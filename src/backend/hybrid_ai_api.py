from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import time
import os
import json
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import numpy as np
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file if it exists
load_dotenv()

# FastAPI app
app = FastAPI(title="Nova AI Hybrid API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
pinecone_available = False
pinecone_client = None
query_handler = None
use_simulation = os.environ.get("USE_SIMULATION", "true").lower() == "true"
embeddings_model = None

# Use on_event for backward compatibility
@app.on_event("startup")
async def startup_db_client():
    global pinecone_available, pinecone_client, query_handler, use_simulation, embeddings_model
    
    # Initialize the embeddings model regardless of Pinecone availability
    try:
        # Use a public model that's available on Hugging Face
        model_name = os.environ.get("EMBEDDINGS_MODEL_NAME", "all-MiniLM-L6-v2")
        logger.info(f"Selected embedding model: {model_name}")

        if model_name.startswith("text-embedding-"):
            embeddings_model = None  # will use OpenAI dynamically later
            logger.info("Using OpenAI for embedding generation — no local model loaded")
        else:
            from sentence_transformers import SentenceTransformer
            try:
                embeddings_model = SentenceTransformer(model_name)
                logger.info("HuggingFace embeddings model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load SentenceTransformer model: {e}")
                embeddings_model = None


    except Exception as e:
        logger.error(f"Error loading embeddings model: {e}")
        embeddings_model = None
    
    if use_simulation:
        logger.info("Running in simulation mode (not connecting to Pinecone)")
        return
    
    try:
        # Import Pinecone
        try:
            from pinecone import Pinecone
            logger.info("Successfully imported Pinecone")
        except ImportError:
            logger.error("Could not import Pinecone. Please install with: pip install pinecone")
            return
        
        # Get Pinecone configuration
        pinecone_api_key = os.environ.get('PINECONE_API_KEY', '')
        index_name = os.environ.get('PINECONE_INDEX_NAME', 'municipal-data')
        
        if not pinecone_api_key:
            logger.warning("No Pinecone API key provided. Running in simulation mode")
            return
        
        # Initialize Pinecone client
        try:
            logger.info(f"Connecting to Pinecone index: {index_name}")
            pc = Pinecone(api_key=pinecone_api_key)
            logger.info("Created Pinecone client")
            
            # List available indexes to verify connection
            try:
                indexes = pc.list_indexes()
                logger.info(f"Available indexes: {indexes.names()}")
                
                if index_name not in indexes.names():
                    logger.warning(f"Index '{index_name}' not found. Available indexes: {indexes.names()}")
                    return
                
                # Get the index
                index = pc.Index(index_name)
                logger.info(f"Connected to index: {index_name}")
                
                # Connection successful
                pinecone_available = True
                pinecone_client = pc
                
                # Create our custom query handler
                try:
                    from pinecone_query import PineconeQueryHandler
                    query_handler = PineconeQueryHandler(index_name, pc_client=pc)
                    logger.info("Initialized PineconeQueryHandler")
                except ImportError as e:
                    logger.warning(f"Could not import PineconeQueryHandler: {e}")
                    logger.warning("Staying in simulation mode")
                except Exception as e:
                    logger.error(f"Error initializing query handler: {e}")
                    logger.warning("Staying in simulation mode")
                
            except Exception as e:
                logger.error(f"Error listing or accessing Pinecone indexes: {e}")
                logger.warning("Running in simulation mode due to index access errors")
                
        except Exception as e:
            logger.error(f"Error initializing Pinecone client: {e}")
            logger.warning("Running in simulation mode due to client initialization errors")
            
    except Exception as e:
        logger.error(f"Error connecting to Pinecone: {e}")
        logger.warning("Running in simulation mode due to errors")

@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info("Shutting down API")

@app.get("/")
async def root():
    return {"message": "Nova AI Hybrid API is running"}

@app.get("/status")
async def status():
    """Get the current status of the API and connections"""
    try:
        # Basic status information
        status_info = {
            "status": "ok",
            "version": "0.4.0",
            "simulation_mode": not pinecone_available or use_simulation,
            "pinecone_available": pinecone_available,
            "embeddings_model": os.environ.get("EMBEDDINGS_MODEL_NAME", "all-MiniLM-L6-v2") if embeddings_model else "None",
            "timestamp": time.time()
        }
        
        # Add Pinecone information if available
        if pinecone_available and not use_simulation:
            try:
                # Add Pinecone-specific info
                status_info.update({
                    "pinecone_status": "connected",
                    "pinecone_index": os.environ.get('PINECONE_INDEX_NAME', 'unknown'),
                    "pinecone_environment": os.environ.get('PINECONE_ENVIRONMENT', 'unknown')
                })
            except Exception as e:
                logger.error(f"Error getting Pinecone status: {e}")
                status_info["pinecone_status"] = "error"
        
        return status_info
    except Exception as e:
        logger.error(f"Error checking status: {e}")
        return {
            "status": "error",
            "message": str(e),
            "simulation_mode": True
        }

@app.post("/query")
async def query(request: dict = Body(...)):
    """Process a query and return a response."""
    global pinecone_available, query_handler, use_simulation, embeddings_model
    
    if "query" not in request or not request["query"]:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    # Extract the query string
    query_text = request["query"].strip()
    context = request.get("context", "general")
    
    if not query_text:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    # Log the query
    logger.info(f"Processing query: '{query_text}' with context: '{context}'")
    
    # Get start time for performance measurement
    start_time = time.time()
    
    # Determine if we should use Pinecone or simulation
    using_pinecone = pinecone_available and query_handler and not use_simulation
    
    try:
        # Use Pinecone if available
        if using_pinecone:
            logger.info("Using Pinecone for query")
            
            # Create context filter based on the selected context
            context_filter = create_context_filter(context)
            
            # Execute query using Pinecone
            response_data = query_handler.query(
                query_text=query_text,
                top_k=5,
                context_filter=context_filter
            )
            
            # Prepare source documents for response (remove score if present)
            source_docs = []
            for doc in response_data.get("source_documents", []):
                # Create a clean copy without the score
                if isinstance(doc, dict):
                    doc_copy = {
                        "content": doc.get("content", ""),
                        "source": doc.get("source", "Unknown Source")
                    }
                else:
                    # Handle the case where doc might be an object with attributes
                    doc_copy = {
                        "content": getattr(doc, "content", getattr(doc, "page_content", "")),
                        "source": getattr(doc, "source", "Unknown Source")
                    }
                source_docs.append(doc_copy)
            
            result = response_data["result"]
        else:
            # Use simulation
            logger.info("Using simulation for query")
            result = simulate_response(query_text, context)
            source_docs = [{
                "content": "This is a simulated response.",
                "source": "simulation.txt"
            }]
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        # Return the response
        return {
            "result": result,
            "processing_time": processing_time,
            "source_documents": source_docs
        }
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        
        # Fallback to simulated response
        fallback_response = {
            "result": "Sorry, I wasn’t able to process your request due to an internal error.",
            "source_documents": [
                {"content": "Backend processing error", "source": "fallback_system.txt"}
            ]
        }
        return {
            "result": fallback_response,
            "processing_time": time.time() - start_time,
            "source_documents": [{
                "content": "Simulated response due to processing error.",
                "source": "fallback_system.txt"
            }]
        }
    

def simulate_response(query_text: str, context: str = "general") -> str:
    """Provide a simulated response when Pinecone is not available"""
    
    # Simple response mapping for common queries
    responses = {
        "who is the mayor": "The current mayor of Phoenixville is Peter Urscheler. He was elected in 2018 and continues to serve the borough.",
        "what are the office hours": "Phoenixville Borough office hours are generally Monday through Friday, 8:00 AM to 4:30 PM. However, specific departments may have different hours.",
        "trash collection": "Trash collection in Phoenixville occurs weekly. The specific day depends on your location within the borough. You can find your collection day on the borough website.",
        "water bill": "Water bills in Phoenixville can be paid online through the borough website, in person at Borough Hall, or by mail. Bills are typically sent quarterly.",
        "property tax": "Property taxes in Phoenixville are collected by the borough. The current tax rate is available on the borough website. Payments can be made online, by mail, or in person."
    }
    
    # Try to find a matching key
    for key, response in responses.items():
        if key in query_text.lower():
            return response
    
    # Default response if no match is found
    return f"I'm currently in simulation mode and don't have specific information about '{query_text}'. In a fully connected system, I would query the municipal database for this information. Please check the Phoenixville Borough website for accurate information."

def create_context_filter(context: str) -> Optional[Dict[str, Any]]:
    """Create a filter for Pinecone query based on the context"""
    
    logger.info(f"Creating context filter for: {context}")
    
    # Based on our test results, we don't have a category field
    # Instead, we'll try to filter based on source_url or source_title if needed
    
    if context == "people":
        # Look for URLs or titles that might indicate people-related content
        return {
            "source_url": {"$contains": "people"}
        }
    elif context == "documents":
        # Look for URLs that contain document references
        return {
            "source_url": {"$contains": "DocumentCenter"}
        }
    elif context == "departments":
        # Look for department-related content
        return {
            "source_title": {"$contains": "Department"}
        }
    else:
        logger.info("No specific filter applied")
        return None  # No filter - will search across all documents


def _generate_embedding(self, text: str) -> List[float]:
    """Generate a text embedding using OpenAI's text-embedding-ada-002 with 1536 dims"""
    try:
        # Using the new OpenAI client with the same model used in database
        response = self.openai_client.embeddings.create(
            model="text-embedding-ada-002",
            input=text
        )
        embedding = response.data[0].embedding
        
        # Normalize the embedding vector (important for cosine similarity)
        norm = np.linalg.norm(embedding)
        if norm > 0:
            normalized_embedding = [float(x) / norm for x in embedding]
            return normalized_embedding
        return embedding
                
    except Exception as e:
        logger.error(f"OpenAI embedding generation error: {e}")
        return [0.0] * 1536  # Match Pinecone dimension for text-embedding-ada-002
    
# Direct execution for development
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)