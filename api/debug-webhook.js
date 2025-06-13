export default async function handler(req, res) {
  console.log('🔍 Debug webhook hit');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Just return success without signature verification
    res.status(200).json({ 
      success: true,
      method: req.method,
      timestamp: new Date().toISOString(),
      message: 'Debug webhook working!'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}