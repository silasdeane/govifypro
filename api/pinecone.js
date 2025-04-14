// api/pinecone.js
import axios from 'axios';

export default async function handler(req, res) {
  // Set CORS headers to allow requests from your domain
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (pre-flight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enhanced error handling in pinecone.js
  try {
    const PINECONE_HOST = 'https://prod-1-data.ke.pinecone.io';
    const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

    if (!PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not configured');
    }

    // Forward the request to Pinecone
    const response = await axios({
      method: 'post',
      url: `${PINECONE_HOST}/assistants/phoenixville/chat`,
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PINECONE_API_KEY
      },
      data: req.body,
      timeout: 10000 // 10 second timeout
    });

    // Return the Pinecone response
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error proxying to Pinecone:', error);
    
    // Return more detailed error information
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.error || error.message;
    
    return res.status(statusCode).json({ 
      error: 'Error connecting to Pinecone',
      details: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
}