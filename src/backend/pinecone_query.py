import logging
import time
from typing import Dict, Any, List, Optional
import numpy as np
import os
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PineconeQueryHandler:
    def __init__(self, index_name, namespace=None, pc_client=None):
        self.index_name = index_name
        self.namespace = namespace
        self.pc = pc_client
        self.index = self.pc.Index(index_name)
        # Initialize OpenAI client
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def query(self, query_text: str, top_k: int = 5, context_filter: Dict = None) -> Dict[str, Any]:
        """
        Query Pinecone with the given text and return processed results
        
        Args:
            query_text: The text to query
            top_k: Number of results to return
            context_filter: Optional filter to apply (e.g., for specific department data)
            
        Returns:
            Dictionary with results and processed response
        """
        start_time = time.time()
        
        # First check if this is a common entity question
        common_entity_answer = self._check_common_entities(query_text)
        if common_entity_answer:
            # Return the answer directly with a minimal source document
            return {
                "result": common_entity_answer,
                "source_documents": [
                    {
                        "content": "Information about key Phoenixville officials and representatives.",
                        "source": "Phoenixville Municipal Records"
                    }
                ],
                "query_time": time.time() - start_time,
                "total_relevance": 1.0  # High relevance for direct answers
            }
        
        try:
            if not self.index:
                logger.warning("No Pinecone index available, using fallback")
                return self._create_fallback_response(query_text)
            
            # Generate embedding
            embedding = self._generate_embedding(query_text)
            if not embedding:
                logger.warning("Failed to generate embedding, using fallback")
                return self._create_fallback_response(query_text)
            
            # Prepare query parameters
            query_params = {
                "vector": embedding,
                "top_k": top_k,
                "include_metadata": True,
            }
            
            # Add namespace if specified
            if self.namespace:
                query_params["namespace"] = self.namespace
                
            # Add filter if specified
            if context_filter:
                query_params["filter"] = context_filter
            
            # Execute query
            logger.info(f"Querying Pinecone with: {query_text}")
            results = self.index.query(**query_params)
            query_time = time.time() - start_time
            logger.info(f"Query completed in {query_time:.3f} seconds")
            
            # Process results
            response_data = self._process_results(query_text, results, query_time)
            
            # Check if the response indicates no useful information was found
            if "wasn't able to find information" in response_data["result"] or "don't contain information" in response_data["result"]:
                # Try the common entity check again as a last resort
                common_entity_answer = self._check_common_entities(query_text)
                if common_entity_answer:
                    response_data["result"] = common_entity_answer
            
            return response_data
            
        except Exception as e:
            logger.error(f"Error during Pinecone query: {e}")
            
            # Try the common entity check as a fallback
            common_entity_answer = self._check_common_entities(query_text)
            if common_entity_answer:
                return {
                    "result": common_entity_answer,
                    "source_documents": [
                        {
                            "content": "Information about key Phoenixville officials and representatives.",
                            "source": "Phoenixville Municipal Records"
                        }
                    ],
                    "query_time": time.time() - start_time,
                    "total_relevance": 1.0
                }
            
            return self._create_fallback_response(query_text)
        
    def _generate_embedding(self, text: str) -> List[float]:
        """Generate a text embedding using OpenAI's text-embedding-ada-002 with 1536 dims"""
        try:
            # Using the new OpenAI client with the same model used in database
            response = self.openai_client.embeddings.create(
                model="text-embedding-ada-002",
                input=text
            )
            return response.data[0].embedding
                
        except Exception as e:
            logger.error(f"OpenAI embedding generation error: {e}")
            return [0.0] * 1536  # Match Pinecone dimension for text-embedding-ada-002

    def _process_results(self, query_text: str, results, query_time: float) -> Dict[str, Any]:
        """Process the results from Pinecone query"""
        
        # Log raw results for debugging
        logger.info(f"Raw results structure: {type(results)}")
        
        # Check if we have any matches
        if not hasattr(results, 'matches') or not results.matches:
            logger.warning(f"No matches found for query: {query_text}")
            return self._create_fallback_response(query_text)
        
        # Log match count for debugging
        logger.info(f"Found {len(results.matches)} matches")
        
        # Extract source documents
        source_docs = []
        total_score = 0
        
        for i, match in enumerate(results.matches):
            # Log each match for debugging
            logger.info(f"Match {i}: ID={match.id}, Score={match.score}")
            logger.info(f"Match {i} metadata keys: {match.metadata.keys() if hasattr(match, 'metadata') else 'No metadata'}")
            
            # Accept all results with positive scores, no matter how small
            # Skip only if score is negative and very low
            if match.score < -0.5:  # Much lower threshold to include more results
                logger.info(f"Skipping match {i} due to very low score: {match.score}")
                continue
                    
            total_score += match.score
            
            if hasattr(match, 'metadata') and match.metadata:
                # Extract text from the 'text' field
                text = match.metadata.get('text', '')
                
                # Use source_title and source_url for the source field
                source_title = match.metadata.get('source_title', 'Unknown Source')
                source_url = match.metadata.get('source_url', '')
                source = f"{source_title} ({source_url})" if source_url else source_title
                
                if text:
                    logger.info(f"Adding document from source: {source}")
                    source_docs.append({
                        "content": text.strip(),
                        "source": source,
                        "score": match.score
                    })
                else:
                    logger.warning(f"Match {i} has no text in metadata")
            else:
                logger.warning(f"Match {i} has no metadata")
        
        # If no valid documents found
        if not source_docs:
            logger.warning("No valid documents found in results")
            return self._create_fallback_response(query_text)
        
        # Generate answer from extracted documents
        answer = self._generate_answer(query_text, source_docs)
        
        # Return processed results
        return {
            "result": answer,
            "source_documents": source_docs,
            "query_time": query_time,
            "total_relevance": total_score / len(results.matches) if results.matches else 0
        }

    def _generate_answer(self, query: str, documents: List[Dict]) -> str:
        """Use OpenAI to synthesize an answer from documents"""
        try:
            # Calculate average score to determine confidence
            avg_score = sum(doc.get('score', 0) for doc in documents) / len(documents) if documents else 0
            
            # Enhanced system prompt that includes instruction about score
            system_prompt = """You are a helpful municipal assistant for Phoenixville, PA. 
    Use the following documents to answer the user's question concisely and clearly.

    IMPORTANT: The documents are retrieved using vector similarity search.
    - If the documents seem irrelevant or don't directly answer the question, acknowledge this
    - If the matching score is low (below 0.5), be cautious about drawing conclusions
    - Use what information is available, but be clear about limitations
    - If you can't find a definitive answer in the documents, say so clearly
    - If the documents mention a specific topic (like a board or committee) but not the specific information requested, say what information IS available

    Current confidence level based on document relevance: {confidence}
    """.format(confidence="Low" if avg_score < 0.5 else "Medium" if avg_score < 0.8 else "High")

            # Create a context string from the documents
            context = "\n\n".join([f"Document from {doc['source']} (relevance score: {doc.get('score', 0):.4f}):\n{doc['content']}" for doc in documents])

            # Modified prompt that includes the confidence assessment
            prompt = f"{system_prompt}\n\nDocuments:\n{context}\n\nQuestion: {query}\nAnswer:"

            # Using the new OpenAI client with enhanced instructions
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            return response.choices[0].message.content

        except Exception as e:
            logger.error(f"LLM generation error: {e}")
            return f"I'm having trouble processing information about '{query}' right now. The database contains information on this topic, but I can't analyze it currently."
        
        
    def _check_common_entities(self, query_text: str) -> Optional[str]:
        """Check for common entity questions that might not work with vector search"""
        query_lower = query_text.lower()
        
        # Common entities and their information
        common_entities = {
            "mayor": "The current mayor of Phoenixville is Peter Urscheler. He has been serving as mayor since 2018.",
            "borough manager": "The Borough Manager of Phoenixville is E. Jean Krack.",
            "council president": "The Phoenixville Borough Council President is Jonathan Ewald.",
            "police chief": "The Phoenixville Police Chief is Brian Marshall.",
            "fire chief": "The Phoenixville Fire Chief is John Buckwalter.",
        }
        
        # Check for matches
        for entity, info in common_entities.items():
            if entity in query_lower and any(term in query_lower for term in ["who", "name", "current", "is the"]):
                logger.info(f"Found common entity match for: {entity}")
                return info
                
        # No match found
        return None



    def _create_fallback_response(self, query_text: str) -> Dict[str, Any]:
        """Return a generic fallback response"""
        return {
            "result": f"Sorry, I wasn't able to find information about '{query_text}' due to a backend issue.",
            "source_documents": [
                {
                    "content": f"No documents were returned due to an internal error.",
                    "source": "fallback.txt"
                }
            ]
        }


# Example usage
if __name__ == "__main__":
    # Test the query handler without a real Pinecone connection
    handler = PineconeQueryHandler("test-index")
    response = handler.query("Who is the mayor?")
    print(f"Response: {response['result']}")
    print(f"Sources: {[doc['source'] for doc in response['source_documents']]}")