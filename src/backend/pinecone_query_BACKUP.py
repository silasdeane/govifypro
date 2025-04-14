import logging
import time
from typing import Dict, Any, List, Optional
import numpy as np

def _generate_answer(self, query: str, documents: List[Dict]) -> str:
    """Use OpenAI to synthesize an answer from documents"""
    try:
        system_prompt = "You are a helpful municipal assistant. Use the following documents to answer the user's question concisely and clearly."

        context = "\n\n".join([f"{doc['content']}" for doc in documents])

        prompt = f"{system_prompt}\n\nDocuments:\n{context}\n\nQuestion: {query}"

        client = OpenAI()
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"LLM generation error: {e}")
        return "I'm having trouble reasoning over the documents right now."


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PineconeQueryHandler:
    def __init__(self, index_name, namespace=None, pc_client=None):
        self.index_name = index_name
        self.namespace = namespace
        self.pc = pc_client
        self.index = self.pc.Index(index_name)

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
            return self._process_results(query_text, results, query_time)
            
        except Exception as e:
            logger.error(f"Error during Pinecone query: {e}")
            return self._create_fallback_response(query_text)
        

    # Update the _generate_embedding method in pinecone_query.py to handle older OpenAI library versions
    def _generate_embedding(self, text: str) -> List[float]:
        """Generate a text embedding using OpenAI's text-embedding-ada-002 with 1536 dims"""
        import openai
        import os

        # Configure the OpenAI API key
        openai.api_key = os.getenv("OPENAI_API_KEY")

        try:
            # Check which version of the OpenAI library is being used
            if hasattr(openai, 'Embedding'):
                # Older version of the library
                response = openai.Embedding.create(
                    model="text-embedding-ada-002",
                    input=text
                )
                embedding = response["data"][0]["embedding"]
                return embedding
            else:
                # Newer version with client object
                from openai import OpenAI
                client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
                
                response = client.embeddings.create(
                    model="text-embedding-ada-002",
                    input=text
                )
                return response.data[0].embedding
                
        except Exception as e:
            logger.error(f"OpenAI embedding generation error: {e}")
            return [0.0] * 1536  # Match Pinecone dimension exactly



    # Update the _process_results method in pinecone_query.py to handle your actual metadata structure
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
            
            # Skip if score is too low - use a lower threshold since our test showed negative scores
            if match.score < -0.3:  # Adjusted threshold based on test results
                logger.info(f"Skipping match {i} due to low score: {match.score}")
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

    
    # Update the _generate_answer method in pinecone_query.py
    # Update the _generate_answer method in pinecone_query.py to handle older OpenAI library versions
    def _generate_answer(self, query: str, documents: List[Dict]) -> str:
        """Use OpenAI to synthesize an answer from documents"""
        try:
            import openai
            import os
            
            # Configure the OpenAI API key
            openai.api_key = os.getenv("OPENAI_API_KEY")
            
            system_prompt = "You are a helpful municipal assistant for Phoenixville, PA. Use the following documents to answer the user's question concisely and clearly. If the documents don't contain the relevant information, say so clearly."

            # Create a context string from the documents
            context = "\n\n".join([f"Document from {doc['source']}:\n{doc['content']}" for doc in documents])

            prompt = f"{system_prompt}\n\nDocuments:\n{context}\n\nQuestion: {query}\nAnswer:"

            # Check which version of the OpenAI library is being used
            if hasattr(openai, 'ChatCompletion'):
                # Older version of the library
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3,
                    max_tokens=500
                )
                return response.choices[0].message.content
            else:
                # Newer version with client object
                from openai import OpenAI
                client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
                
                response = client.chat.completions.create(
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
        
    def _create_fallback_response(self, query_text: str) -> Dict[str, Any]:
        """Return a generic fallback response"""
        return {
            "result": f"Sorry, I wasn’t able to find information about '{query_text}' due to a backend issue.",
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