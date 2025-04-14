// api/pinecone.js
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

  try {
    const PINECONE_HOST = process.env.REACT_APP_PINECONE_HOST || 'https://prod-1-data.ke.pinecone.io';
    const PINECONE_API_KEY = process.env.PINECONE_API_KEY || process.env.REACT_APP_PINECONE_API_KEY;

    if (!PINECONE_API_KEY) {
      console.error('API key not found in environment variables');
      return res.status(500).json({ error: 'Server configuration error - API key missing' });
    }

    console.log('Making request to Pinecone at:', `${PINECONE_HOST}/assistants/phoenixville/chat`);
    
    // Forward the request to Pinecone
    const response = await fetch(`${PINECONE_HOST}/assistants/phoenixville/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PINECONE_API_KEY
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pinecone API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `Pinecone API error: ${response.status}`,
        details: errorText
      });
    }

    // Return the Pinecone response
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying to Pinecone:', error);
    return res.status(500).json({ 
      error: 'Error connecting to Pinecone',
      details: error.message
    });
  }
}