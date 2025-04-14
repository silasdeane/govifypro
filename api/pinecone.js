// api/pinecone.js
export default async function handler(req, res) {
  console.log('API route hit: /api/pinecone');
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
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
    const PINECONE_HOST = process.env.PINECONE_HOST || 'https://prod-1-data.ke.pinecone.io';
    const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

    console.log('Environment variables:');
    console.log('- PINECONE_HOST:', PINECONE_HOST);
    console.log('- PINECONE_API_KEY exists:', !!PINECONE_API_KEY);

    if (!PINECONE_API_KEY) {
      console.error('API key not found in environment variables');
      return res.status(500).json({ error: 'Server configuration error - API key missing' });
    }

    // Format messages according to Pinecone's expected format
    const messages = req.body.messages.map(msg => ({
      role: msg.role,
      content: msg.content
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
      body: JSON.stringify({ messages })
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
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying to Pinecone:', error);
    return res.status(500).json({ 
      error: 'Error connecting to Pinecone',
      details: error.message
    });
  }
}