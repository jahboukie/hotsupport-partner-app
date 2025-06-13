export default function handler(req, res) {
  res.status(200).json({ 
    message: 'API endpoint working!',
    method: req.method,
    timestamp: new Date().toISOString()
  });
}