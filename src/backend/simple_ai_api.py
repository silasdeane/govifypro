from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import time
from typing import Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the FastAPI app
app = FastAPI(title="Nova AI API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Nova AI API is running"}

@app.get("/status")
async def status():
    # Simple status endpoint
    return {
        "status": "ok",
        "version": "0.1.0",
        "simulation_mode": True
    }

@app.post("/query")
async def query(request: dict = Body(...)):
    """Process a query and return a response."""
    if "query" not in request or not request["query"]:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    # Extract the query string
    query = request["query"].strip()
    context = request.get("context", "general")
    
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    # Simulate AI processing time
    time.sleep(1)
    
    # Generate a response based on the query
    response_text = generate_response(query, context)
    
    # Return the response
    return {
        "result": response_text,
        "processing_time": 1.0,
        "source_documents": [
            {
                "content": "Sample document content related to the query.",
                "source": "sample_document.pdf"
            }
        ]
    }

def generate_response(query: str, context: str) -> str:
    """Generate a response based on the query and context."""
    query = query.lower()
    
    # Basic response logic based on context and query
    if context == "people":
        if "housing" in query:
            return "I've identified 87 constituents currently seeking housing assistance. 42 are in the application process, 31 are awaiting verification, and 14 are ready for placement. Would you like me to analyze housing availability in each district?"
        elif "staff" in query and "performance" in query:
            return "Staff performance is trending upward across departments. Parks & Recreation has shown the most improvement (+12%), while Technology department may require attention (-4%). I can provide detailed reports for any department."
        elif "engagement" in query:
            return "Constituent engagement has increased 8% this quarter. The downtown development forum had the highest participation (378 attendees). I recommend focusing on the southern district where engagement is lowest. Should I draft an outreach plan?"
        else:
            return f"I've analyzed your request about '{query}' in the context of people data. There are 24,387 constituents and 346 staff members in the system. How can I assist you further with this inquiry?"
    
    elif context == "documents":
        return f"I've found several documents related to '{query}'. The most relevant ones include budget proposals, policy guidelines, and meeting minutes. Would you like me to summarize any specific document?"
    
    elif context == "departments":
        return f"There are 14 departments in the system. Based on your query about '{query}', the most relevant departments would be Public Works, Parks & Recreation, and Community Services. Would you like specific information about any of these departments?"
    
    else:
        return f"I'm analyzing your request about '{query}'. Can you provide more specific details about what you're looking for?"

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)