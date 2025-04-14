# Nova AI Assistant for Govify

This repository contains the implementation of the Nova AI Assistant system for the Govify municipal management dashboard. The system consists of two main components:

1. A React-based frontend component (`NovaAssistant.jsx`) that provides the chat interface
2. A Python FastAPI backend service that handles AI queries using Pinecone vector database

## Frontend Component

The `NovaAssistant.jsx` component can be integrated into any React application and provides:

- Real-time AI chat interface with context switching
- Fallback to simulation mode when API is unavailable
- Support for different message types (info, warning, critical, etc.)
- Citation of source documents when available
- Context-aware responses for different municipal domains

## Backend API

The backend API server provides:

- Vector-based semantic search using Pinecone
- Automatic fallback to simulation when database is unavailable
- Context filtering for domain-specific queries
- Embedding generation for query processing
- RESTful API for integration with various clients

## Setup Instructions

### Backend Setup

1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file with the following variables:
   ```
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX_NAME=your_index_name
   EMBEDDINGS_MODEL_NAME=all-MiniLM-L6-v2
   USE_SIMULATION=false
   ```

   If you don't have a Pinecone account, set `USE_SIMULATION=true` to run in simulation mode.

4. Start the server:
   ```bash
   uvicorn hybrid_ai_api:app --reload
   ```

   The API will be available at http://localhost:8000

### Frontend Integration

1. Copy the `NovaAssistant.jsx` component to your React project.

2. Import and use the component:
   ```jsx
   import NovaAssistant from './components/NovaAssistant';
   
   function App() {
     return (
       <div className="app">
         {/* Your app content */}
         <NovaAssistant context="people" />
       </div>
     );
   }
   ```

3. Configure the API endpoint in your environment variables or directly in the component.

## API Endpoints

- `GET /status` - Check API and database connection status
- `POST /query` - Send a query and get a response
  ```json
  {
    "query": "Show housing assistance cases",
    "context": "people"
  }
  ```

## Simulation Mode

If running without Pinecone or in development, the system will automatically use simulation mode, providing realistic but pre-defined responses based on the query content.

## Developer Notes

- The system uses SentenceTransformers for embedding generation
- For production, ensure you have sufficient Pinecone quota
- The frontend design is based on Tailwind CSS
- Context switching is available for "people", "documents", and "departments"

## License

This project is proprietary and confidential. All rights reserved.