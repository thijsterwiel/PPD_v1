export default function handler(req, res) {
    res.status(200).json({ 
      message: 'API is working',
      salsifyApiKey: process.env.SALSIFY_API_KEY ? 'Set' : 'Not set'
    });
  }