#!/usr/bin/env python3
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Body, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
import uvicorn
import os
import sys
import shutil
import random
import logging
from datetime import datetime
from typing import List, Optional
import pinecone
from PIL import Image, ImageDraw
import io

from starlette.responses import StreamingResponse
import json
import asyncio

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

# Models
class QueryRequest(BaseModel):
    query: str

class Document(BaseModel):
    content: str
    source: str

class QueryResponse(BaseModel):
    result: str
    source_documents: Optional[List[Document]] = None
    processing_time: Optional[float] = None
    map_data: Optional[dict] = None

class PaymentRequest(BaseModel):
    account_number: str
    amount: float
    payment_method: str
    email: str

class IngestResponse(BaseModel):
    status: str
    documents_processed: int

# Constants
MAP_KEYWORDS = [
    "where is", "location of", "map", "show me", "directions to", "zoning",
    "find", "show on map", "navigate to", "borough boundaries", "district map",
    "utility service", "water service area", "sewer service", "permits",
    "permit status"
]

FORM_KEYWORDS = [
    "permit", "application", "form", "apply for", "how do i get a", 
    "need a permit", "building permit", "construction permit", 
    "deck permit", "patio permit", "renovation permit", "demolition permit",
    "home improvement", "how to apply", "permit application"
]

FORM_MAPPINGS = {
    # Form mappings as defined in your original file
    "deck": {
        "form_id": "deck-patio-permit",
        "title": "Deck/Patio Permit Application",
        "description": "Application for construction of a deck or patio"
    },
    # ... other form mappings
}

LOCATION_MAPPINGS = {
    # Location mappings as defined in your original file
    "borough hall": {"lat": 40.1308, "lng": -75.5146, "zoom": 18, "layer": "locations"},
    # ... other location mappings
}

# Load Pinecone configuration
pinecone_api_key = os.environ.get('PINECONE_API_KEY', 'pcsk_1MfLA_QRmNnRSR4pumc7thAYp6eqHkxGF3Jhmbs9X66SN2i1Rr4akBzmERV5NCjyBhE8e')
pinecone_environment = os.environ.get('PINECONE_ENVIRONMENT', 'us-east-1')
index_name = os.environ.get('PINECONE_INDEX_NAME', 'open-ai-database')

# Import your privateGPT modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
try:
    from pinecone_new_private_gpt import create_qa_chain, process_query
    from pinecone_ingest import process_documents, initialize_pinecone, does_index_exist, add_embeddings_to_pinecone
    from langchain.embeddings import HuggingFaceEmbeddings
    # Import our custom embeddings adapter
    from lanchain_pinecone_adapter import CustomHuggingFaceEmbeddings
except ImportError as e:
    logger.error(f"Could not import some modules: {e}")

# Helper functions
def is_form_query(query: str) -> bool:
    query_lower = query.lower()
    return any(keyword in query_lower for keyword in FORM_KEYWORDS)

def get_form_type(query: str) -> dict:
    query_lower = query.lower()
    
    # First check for specific form types
    for form_type, details in FORM_MAPPINGS.items():
        if form_type in query_lower:
            return details
    
    # If we don't find a specific match but have "building" in FORM_MAPPINGS, use that
    if "building" in FORM_MAPPINGS:
        return FORM_MAPPINGS["building"]
    
    # Fallback to the first available form if "building" isn't available
    return next(iter(FORM_MAPPINGS.values()))

def generate_form_response(query: str) -> dict:
    form_details = get_form_type(query)
    
    # Create contextual message based on the query and form type
    message = f"Here's the {form_details['title']} you requested. You can fill it out directly or download it for submission to the Borough offices."
    
    # Create a form portal tag similar to the payment portal
    form_portal = f"<form_portal>{message}|{form_details['form_id']}|{form_details['title']}</form_portal>"
    
    # Return the response object
    return {
        "result": form_portal,
        "processing_time": 0.1,
        "source_documents": [],
        "form_data": form_details
    }

def is_map_query(query: str) -> bool:
    query_lower = query.lower()
    return any(keyword in query_lower for keyword in MAP_KEYWORDS)

def get_location_focus(query: str) -> dict:
    query_lower = query.lower()
    
    for location, coords in LOCATION_MAPPINGS.items():
        if location in query_lower:
            return coords
    
    # Default to center of Phoenixville
    return {"lat": 40.1308, "lng": -75.5146, "zoom": 14, "layer": "locations"}

def generate_map_response(query: str) -> dict:
    location_focus = get_location_focus(query)
    
    # Create contextual message based on the query and location
    if "zoning" in query.lower():
        message = "Here's the zoning map for Phoenixville Borough. The colored areas represent different zoning districts."
        location_focus["layer"] = "zoning"
    elif "utility" in query.lower() or "water service" in query.lower() or "sewer" in query.lower():
        message = "Here's the utility service map for Phoenixville Borough. The shaded areas show water and sewer service coverage."
        location_focus["layer"] = "utilities"
    elif "permit" in query.lower():
        message = "Here's a map showing recent permits issued in Phoenixville Borough. Click on the markers for details about each permit."
        location_focus["layer"] = "permits"
    elif any(place in query.lower() for place in ["borough hall", "police", "fire", "library", "reeves park", "black rock"]):
        place = next((place for place in ["borough hall", "police", "fire", "library", "reeves park", "black rock"] if place in query.lower()), "")
        message = f"Here's the location of {place.title()} in Phoenixville Borough. You can click on the marker for more details."
    else:
        message = "Here's an interactive map of Phoenixville Borough. You can toggle between different map layers using the controls below the map."
    
    # Create a map portal tag similar to the payment portal
    map_portal = f"<map_portal>{message}</map_portal>"
    
    # Return the response object
    return {
        "result": map_portal,
        "processing_time": 0.1,
        "source_documents": [],
        "map_data": location_focus
    }

# Application lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    try:
        # Initialize Pinecone
        pinecone.init(api_key=pinecone_api_key, environment=pinecone_environment)


        
        # Check if the index exists
        indexes = pc.list_indexes()
        index_exists = index_name in indexes.names()
        
        # If index exists, try to create QA chain
        if index_exists:
            logger.info(f"Initializing QA chain with existing Pinecone index: {index_name}")
            try:
                create_qa_chain()
                logger.info("QA chain initialized with Pinecone vectorstore")
            except Exception as e:
                logger.error(f"Error initializing QA chain: {e}", exc_info=True)
                logger.warning("You can still use the API, but you'll need to ingest documents first")
        else:
            logger.warning(f"Pinecone index '{index_name}' does not exist. Upload documents to create it.")
    except Exception as e:
        logger.error(f"Error during startup: {e}", exc_info=True)
        logger.warning("Application will start, but you may need to create a Pinecone index first")
        
    yield
    
    # Shutdown code (if needed)
    logger.info("Shutting down application")

# Create the FastAPI app
app = FastAPI(title="Phoenixville Municipal AI", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

############################################################################
############################################################################
############################################################################
############################################################################

@app.get("/")
async def root():
    return FileResponse("static/command-center.html")


############################################################################
############################################################################
############################################################################



@app.get("/api/placeholder/{width}/{height}")
async def placeholder_image(width: int, height: int):
    """Generate a simple placeholder image with the requested dimensions."""
    try:
        # Create a simple gray placeholder image with a border
        img = Image.new('RGB', (width, height), color=(200, 200, 200))
        draw = ImageDraw.Draw(img)
        draw.rectangle([(0, 0), (width-1, height-1)], outline=(100, 100, 100))
        
        # Convert to bytes
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        return Response(content=img_byte_arr.getvalue(), media_type="image/png")
    except Exception as e:
        logger.error(f"Error generating placeholder image: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query", response_model=QueryResponse)
async def query(request: dict = Body(...)):
    """Process a query and return a response."""
    if "query" not in request or not request["query"]:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    # Extract the query string
    clean_query = request["query"].strip()
    if not clean_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    # Check if streaming is requested
    if request.get("stream", False):
        # Implement streaming logic here if needed
        pass
    
    # Check if this is a payment-related query
    payment_keywords = ["pay water bill", "water bill payment", "pay my water", 
                      "how do i pay my water", "pay utility bill", "water payment"]
    
    # If the query contains payment keywords, return the payment portal indicator
    if any(keyword in clean_query.lower() for keyword in payment_keywords):
        return {
            "result": "<payment_portal>I can help you pay your water bill right here. Please use the secure payment form below:</payment_portal>",
            "processing_time": 0.1,
            "source_documents": []
        }
    
    # Check if this is a form-related query
    if is_form_query(clean_query):
        return generate_form_response(clean_query)
    
    # Check if this is a map-related query
    if is_map_query(clean_query):
        return generate_map_response(clean_query)
    
    try:
        # Only use the Pinecone database for responses
        result = process_query(clean_query)
        
        # Format the response
        response = {
            "result": str(result.get("result", "I don't have that information in my database.")),
            "processing_time": result.get("processing_time", 0)
        }
        
        # Include source documents if available
        source_docs = []
        if "source_documents" in result and result["source_documents"]:
            for doc in result["source_documents"]:
                if hasattr(doc, 'page_content') and hasattr(doc, 'metadata'):
                    source_docs.append({
                        "content": str(doc.page_content),
                        "source": str(doc.metadata.get("source", "Unknown Source"))
                    })
            
        response["source_documents"] = source_docs
        
        return response
    
    except Exception as e:
        logger.error(f"Error in query endpoint: {e}", exc_info=True)
        return {
            "result": "I can only answer questions about Phoenixville Borough services and resources. Please try a different question related to municipal services.",
            "processing_time": 0,
            "source_documents": []
        }

@app.post("/query-stream")
async def query_stream(request: dict = Body(...)):
    """Streaming version of the query endpoint that returns tokens as they're generated."""
    if "query" not in request or not request["query"]:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    # Sanitize the query
    clean_query = request["query"].strip()
    if not clean_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    # Determine if this is a special query type
    # For payment portal, map, and forms, we'll return the full response immediately
    payment_keywords = ["pay water bill", "water bill payment", "pay my water", 
                      "how do i pay my water", "pay utility bill", "water payment"]
    
    # If the query contains payment keywords, return the payment portal indicator
    if any(keyword in clean_query.lower() for keyword in payment_keywords):
        return StreamingResponse(
            stream_single_response("<payment_portal>I can help you pay your water bill right here. Please use the secure payment form below:</payment_portal>"),
            media_type="application/json"
        )
    
    # Check if this is a form-related query
    if is_form_query(clean_query):
        form_response = generate_form_response(clean_query)
        return StreamingResponse(
            stream_single_response(form_response["result"]),
            media_type="application/json"
        )
    
    # Check if this is a map-related query
    if is_map_query(clean_query):
        map_response = generate_map_response(clean_query)
        return StreamingResponse(
            stream_single_response(map_response["result"]),
            media_type="application/json"
        )
    
    # For normal queries, stream the response from the LLM
    try:
        return StreamingResponse(
            stream_llm_response(clean_query),
            media_type="application/json"
        )
    except Exception as e:
        logger.error(f"Error in streaming query: {e}", exc_info=True)
        return StreamingResponse(
            stream_single_response("I encountered an error processing your request. Please try again."),
            media_type="application/json"
        )
    

# Helper function to stream a single response (for special responses)
async def stream_single_response(response_text):
    """Stream a single response one character at a time."""
    # Send the full message at once for special portal responses
    response_json = json.dumps({"token": response_text, "done": True})
    yield response_json

# Helper function to stream LLM response token by token
async def stream_llm_response(query):
    """Stream the LLM response token by token."""
    try:
        # Import necessary components for streaming
        from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
        from langchain.callbacks.base import BaseCallbackHandler
        from langchain.llms import Ollama
        
        # Check for fallback responses first for common queries
        query_lower = query.lower()
        fallback_response = None
        
        # Borough Hall hours fallback
        if ("hall hours" in query_lower or "borough hall" in query_lower and "hour" in query_lower):
            fallback_response = "Borough Hall is open Monday through Friday from 8:00 AM to 4:30 PM, except on holidays. The address is 351 Bridge Street, Phoenixville, PA 19460. You can call (610) 933-8801 for more information."
            
        # Trash pickup fallback
        elif ("trash" in query_lower or "garbage" in query_lower or "pickup" in query_lower):
            fallback_response = "Trash collection in Phoenixville Borough occurs once a week on your designated day. Recycling is collected every other week. For your specific collection day, please check the Borough website or call (610) 933-8801."
        
        # Public meeting fallback
        elif ("meeting" in query_lower or "council" in query_lower):
            fallback_response = "Phoenixville Borough Council meetings are typically held on the second Tuesday of each month at 7:00 PM at Borough Hall. Committee meetings occur throughout the month. Please check the Borough calendar for specific dates and times."
        
        # If we have a fallback response, use it instead of calling the LLM
        if fallback_response:
            yield json.dumps({"token": fallback_response, "done": True})
            return
        
        # Custom streaming callback handler
        class StreamingHandler(BaseCallbackHandler):
            def __init__(self):
                self.tokens = []
                self.total_tokens = 0
                
            def on_llm_new_token(self, token, **kwargs):
                # Add the token to our collection
                response_json = json.dumps({"token": token, "done": False})
                self.tokens.append(response_json)
                self.total_tokens += 1

            async def get_tokens(self):
                if not self.tokens:
                    # Return a fallback message if no tokens were generated
                    yield json.dumps({
                        "token": "I don't have specific information about that in my database. Please contact Borough Hall directly for the most accurate information.", 
                        "done": True
                    })
                    return
                    
                for token in self.tokens:
                    yield token
                    # Small delay to simulate typing
                    await asyncio.sleep(0.01)
                # Send the done signal
                yield json.dumps({"token": "", "done": True})

        
        # Initialize the streaming handler
        streaming_handler = StreamingHandler()
        
        # Process the query with streaming enabled
        try:
            # This part will depend on your process_query implementation
            # You'll need to modify it to use the streaming handler
            from pinecone_new_private_gpt import process_query_streaming
            
            # Call the streaming version of process_query
            result = await process_query_streaming(query, callback_handler=streaming_handler)
            
            # Log info about tokens
            logger.info(f"Generated {streaming_handler.total_tokens} tokens for query: '{query}'")
            
            # Stream the tokens
            async for token in streaming_handler.get_tokens():
                yield token
                
        except Exception as e:
            logger.error(f"Error in streaming LLM response: {e}", exc_info=True)
            yield json.dumps({"token": f"I encountered an error processing your request: {str(e)}. Please try again.", "done": True})
    
    except Exception as e:
        logger.error(f"Error setting up streaming: {e}", exc_info=True)
        yield json.dumps({"token": "I encountered an error setting up the response stream. Please try again.", "done": True})

@app.post("/simulate-payment")
async def simulate_payment(request: PaymentRequest):
    """
    Simulates processing a water bill payment.
    No actual payment is processed - this is for demonstration only.
    """
    try:
        # This would connect to your payment processor in a real implementation
        return {
            "status": "success",
            "transaction_id": f"PHX-{random.randint(100000, 999999)}",
            "date": datetime.now().isoformat(),
            "amount": request.amount,
            "account_number": request.account_number
        }
    except Exception as e:
        logger.error(f"Error processing payment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-documents")
async def upload_documents(files: List[UploadFile] = File(...)):
    """
    Upload one or more documents to be processed by the ingest system.
    """
    try:
        source_dir = os.environ.get('SOURCE_DIRECTORY', 'source_documents')
        
        # Create the directory if it doesn't exist
        os.makedirs(source_dir, exist_ok=True)
        
        uploaded_files = []
        
        # Save each uploaded file
        for file in files:
            file_path = os.path.join(source_dir, file.filename)
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            uploaded_files.append({
                "filename": file.filename,
                "size": os.path.getsize(file_path),
                "path": file_path
            })
        
        return {
            "status": "success",
            "message": f"Successfully uploaded {len(uploaded_files)} file(s)",
            "files": uploaded_files
        }
    except Exception as e:
        logger.error(f"Error uploading documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ingest", response_model=IngestResponse)
async def ingest():
    try:
        # Process documents from your source directory
        texts = process_documents()
        if not texts:
            return {
                "status": "no_documents",
                "documents_processed": 0
            }
        
        # Create embeddings using the specified model
        logger.info("Creating embeddings...")
        try:
            # Try using our custom embeddings adapter for 1024 dimensions
            embeddings = CustomHuggingFaceEmbeddings()
            logger.info("Using custom 1024-dimensional embeddings compatible with llama-text-embed-v2")
        except Exception as e:
            # Fall back to standard embeddings if there's any issue
            logger.error(f"Error with custom embeddings: {e}")
            embeddings = HuggingFaceEmbeddings(
                model_name=os.environ.get("EMBEDDINGS_MODEL_NAME", "text-embedding-ada-002")
            )
            logger.info("Using standard embeddings")
        
        # Initialize or get existing Pinecone index
        pinecone.init(api_key=pinecone_api_key, environment=pinecone_environment)
        index = initialize_pinecone()
        
        # We'll use our custom function to add vectors directly to Pinecone
        add_embeddings_to_pinecone(texts, embeddings)
        
        logger.info("Vectors added to Pinecone successfully!")
        
        # Reinitialize the QA chain to use the updated vectorstore
        create_qa_chain()
        
        return {
            "status": "success",
            "documents_processed": len(texts)
        }
    
    except Exception as e:
        logger.error(f"Error during ingestion: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-documents")
async def analyze_documents():
    try:
        import subprocess
        result = subprocess.run(["python", "pinecone_municipal_doc_extractor.py"], 
                               capture_output=True, text=True)
        return {
            "status": "success",
            "output": result.stdout,
            "error": result.stderr
        }
    except Exception as e:
        logger.error(f"Error during document analysis: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/log-chat")
async def log_chat(log_data: dict):
    """
    Log chatbot interactions for analytics.
    """
    try:
        logger.info(f"Logging interaction: {log_data}")
        
        # Example of storing in a simple CSV for demonstration
        import csv
        
        log_file = "chat_logs.csv"
        file_exists = os.path.isfile(log_file)
        
        with open(log_file, mode='a', newline='') as file:
            fieldnames = ['timestamp', 'type', 'message', 'user_id']
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            
            if not file_exists:
                writer.writeheader()
            
            # Add user_id if provided, otherwise use anonymous
            log_data['user_id'] = log_data.get('user_id', 'anonymous')
            writer.writerow(log_data)
            
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error logging chat: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/admin")
async def admin_dashboard():
    # In production, add authentication here
    return FileResponse("admin-dashboard.html")

@app.get("/status")
async def status():
    # Initialize Pinecone
    try:
        pinecone.init(api_key=pinecone_api_key, environment=pinecone_environment)

        
        # Check if the index exists
        indexes = pc.list_indexes()
        index_exists = index_name in indexes.names()
        
        # If index exists, get stats
        stats = None
        if index_exists:
            index = pinecone.Index(index_name)
            stats = index.describe_index_stats()
            
        return {
            "database_initialized": index_exists,
            "model": os.environ.get("MODEL", "mistral"),
            "embeddings_model": os.environ.get("EMBEDDINGS_MODEL_NAME", "text-embedding-ada-002"),
            "vector_count": stats.total_vector_count if stats else 0,
            "dimension": stats.dimension if stats else None,
            "index_fullness": stats.index_fullness if stats else 0,
            "namespaces": list(stats.namespaces.keys()) if stats and hasattr(stats, 'namespaces') else []
        }
    except Exception as e:
        logger.error(f"Error checking Pinecone status: {e}")
        return {
            "database_initialized": False,
            "model": os.environ.get("MODEL", "mistral"),
            "embeddings_model": os.environ.get("EMBEDDINGS_MODEL_NAME", "text-embedding-ada-002"),
            "error": str(e)
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)