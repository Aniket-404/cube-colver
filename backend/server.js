import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Rubiks Cube Solver Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Basic API endpoints placeholder
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Rubiks Cube Solver API',
    endpoints: {
      health: '/health',
      solve2x2x2: '/api/solve/2x2x2',
      solve3x3x3: '/api/solve/3x3x3',
      solve4x4x4: '/api/solve/4x4x4'
    }
  });
});

// Placeholder solver endpoints
app.post('/api/solve/2x2x2', (req, res) => {
  res.json({ message: '2x2x2 solver endpoint - Coming soon!' });
});

app.post('/api/solve/3x3x3', (req, res) => {
  res.json({ message: '3x3x3 solver endpoint - Coming soon!' });
});

app.post('/api/solve/4x4x4', (req, res) => {
  res.json({ message: '4x4x4 solver endpoint - Coming soon!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Rubiks Cube Solver Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API info: http://localhost:${PORT}/api`);
});