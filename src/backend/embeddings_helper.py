from sentence_transformers import SentenceTransformer
import numpy as np
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmbeddingsHelper:
    """Helper class to generate embeddings for text using Sentence Transformers."""
    
    def __init__(self, model_name=None):
        """Initialize the embeddings helper with a specific model."""
        # Use environment variable or default to a good general model
        self.model_name = model_name or os.environ.get("EMBEDDINGS_MODEL_NAME", "all-MiniLM-L6-v2")
        
        try:
            logger.info(f"Loading embedding model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            logger.info(f"Embedding model loaded successfully")
            self.embedding_dimension = self.model.get_sentence_embedding_dimension()
            logger.info(f"Embedding dimension: {self.embedding_dimension}")
        except Exception as e:
            logger.error(f"Error loading embedding model: {e}")
            self.model = None
            self.embedding_dimension = 384  # Default dimension for many models
    
    def generate_embedding(self, text):
        """Generate embedding for a text string."""
        if not text or not isinstance(text, str):
            logger.warning(f"Invalid text for embedding: {text}")
            # Return zero vector of appropriate dimension
            return [0.0] * self.embedding_dimension
        
        try:
            if self.model:
                embedding = self.model.encode(text)
                # Convert to list and handle numpy types
                if isinstance(embedding, np.ndarray):
                    embedding = embedding.tolist()
                return embedding
            else:
                logger.warning("Model not loaded, returning random embedding")
                # Return small random values (for testing only)
                import random
                return [random.uniform(-0.01, 0.01) for _ in range(self.embedding_dimension)]
        
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            # Return zero vector
            return [0.0] * self.embedding_dimension
    
    def get_dimension(self):
        """Return the dimension of the embeddings."""
        return self.embedding_dimension
    
    def pad_embedding(self, embedding, target_dim=None):
        """
        Pad or truncate embedding to target dimension.
        Useful when interfacing with systems expecting specific dimensions.
        """
        if target_dim is None:
            target_dim = self.embedding_dimension
        
        current_dim = len(embedding)
        
        if current_dim == target_dim:
            return embedding
        
        # If smaller, pad with zeros
        if current_dim < target_dim:
            padding = [0.0] * (target_dim - current_dim)
            return embedding + padding
        
        # If larger, truncate
        return embedding[:target_dim]

# Example usage
if __name__ == "__main__":
    helper = EmbeddingsHelper()
    
    # Test with a simple sentence
    test_text = "This is a test sentence for embedding generation"
    embedding = helper.generate_embedding(test_text)
    
    print(f"Generated embedding with dimension: {len(embedding)}")
    print(f"First few values: {embedding[:5]}")