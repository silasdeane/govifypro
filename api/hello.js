// api/hello.js
export default function handler(req, res) {
    res.status(200).json({ 
      message: 'API route is working!',
      status: 'online',
      timestamp: new Date().toISOString()
    });
  }