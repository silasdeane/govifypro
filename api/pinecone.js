// api/pinecone.js
export default async function handler(req, res) {
  console.log('API route hit: /api/pinecone');
  
  // Set CORS headers to allow requests from your domain
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // In production, set this to your specific domain
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log(`Method not allowed: ${req.method}`);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the required environment variables
    // Make sure these are set in your Vercel environment
    const PINECONE_HOST = process.env.PINECONE_HOST || 'https://prod-1-data.ke.pinecone.io';
    const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

    console.log('Environment variables:');
    console.log('- PINECONE_HOST:', PINECONE_HOST);
    console.log('- PINECONE_API_KEY exists:', !!PINECONE_API_KEY);

    if (!PINECONE_API_KEY) {
      console.error('API key not found in environment variables');
      return res.status(500).json({ error: 'Server configuration error - API key missing' });
    }

    // Log the request structure without revealing sensitive info
    console.log('Request body structure:', JSON.stringify({
      hasMessages: !!req.body.messages,
      messageCount: req.body.messages ? req.body.messages.length : 0
    }));

    // Prepare the request to Pinecone
    const pineconeUrl = `${PINECONE_HOST}/assistants/phoenixville/chat`;
    console.log('Making request to Pinecone at:', pineconeUrl);
    
    // Forward the request to Pinecone
    const response = await fetch(pineconeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PINECONE_API_KEY
      },
      body: JSON.stringify({
        messages: req.body.messages
      })
    });

    console.log('Pinecone response status:', response.status);

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
    console.log('Successfully received response from Pinecone');
    
    // Log the response structure without revealing sensitive info
    console.log('Response structure:', JSON.stringify({
      hasMessage: !!data.message,
      messageRole: data.message ? data.message.role : null
    }));
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying to Pinecone:', error);
    return res.status(500).json({ 
      error: 'Error connecting to Pinecone',
      details: error.message
    });
  }
}