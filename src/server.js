const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware for JSON parsing
app.use(express.json());

// Import route handlers
const blogRoutes = require('./routes/blogRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Use route handlers
app.use('/api', blogRoutes);
app.use('/api', searchRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
