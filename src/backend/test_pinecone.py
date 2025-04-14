#!/usr/bin/env python3
"""
Test script to verify Pinecone connection and understand index metadata structure
"""

import os
import logging
from dotenv import load_dotenv
from pinecone import Pinecone

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def test_pinecone_connection():
    """Test connection to Pinecone and examine index structure"""
    
    # Get configuration from environment variables
    pinecone_api_key = os.environ.get('PINECONE_API_KEY')
    pinecone_environment = os.environ.get('PINECONE_ENVIRONMENT', 'us-east-1')
    index_name = os.environ.get('PINECONE_INDEX_NAME', 'open-ai-database')
    
    if not pinecone_api_key:
        logger.error("No Pinecone API key found in environment variables")
        return
    
    try:
        # Initialize Pinecone client
        logger.info(f"Connecting to Pinecone with index: {index_name}")
        pc = Pinecone(api_key=pinecone_api_key)
        
        # List available indexes
        indexes = pc.list_indexes()
        logger.info(f"Available indexes: {indexes.names()}")
        
        if index_name not in indexes.names():
            logger.error(f"Index '{index_name}' not found. Available indexes: {indexes.names()}")
            return
        
        # Connect to the index
        index = pc.Index(index_name)
        logger.info(f"Connected to index: {index_name}")
        
        # Get index stats
        stats = index.describe_index_stats()
        logger.info(f"Index stats: {stats}")
        
        # Try a simple query to understand metadata structure
        logger.info("Running a test query to examine metadata structure...")
        
        vector_dimension = 1536  # Should match your index dimension
        test_vector = [0.1] * vector_dimension  # Simple test vector
        
        results = index.query(
            vector=test_vector,
            top_k=5,
            include_metadata=True
        )
        
        # Check matches
        if not hasattr(results, 'matches') or not results.matches:
            logger.warning("No matches found in test query")
            return
        
        # Examine metadata structure of the first result
        logger.info(f"Found {len(results.matches)} matches in test query")
        first_match = results.matches[0]
        
        logger.info(f"First match ID: {first_match.id}")
        logger.info(f"First match score: {first_match.score}")
        
        # Examine metadata structure
        if hasattr(first_match, 'metadata') and first_match.metadata:
            logger.info("Metadata structure:")
            for key, value in first_match.metadata.items():
                logger.info(f"  {key}: {type(value).__name__} = {value}")
        else:
            logger.warning("No metadata in match")
            
        # Check for existence of text/content and source fields
        metadata = getattr(first_match, 'metadata', {})
        if metadata:
            text_field = metadata.get('text', metadata.get('content', None))
            source_field = metadata.get('source', None)
            
            logger.info(f"Text field found: {'Yes' if text_field else 'No'}")
            logger.info(f"Source field found: {'Yes' if source_field else 'No'}")
            
            # Check for category field (used in filtering)
            category_field = metadata.get('category', None)
            logger.info(f"Category field found: {'Yes' if category_field else 'No'}")
            if category_field:
                logger.info(f"Category value: {category_field}")
        
    except Exception as e:
        logger.error(f"Error testing Pinecone connection: {e}")

if __name__ == "__main__":
    test_pinecone_connection()