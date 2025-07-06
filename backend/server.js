const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

dotenv.config();

const app = express();

// Configure body parser with large limits for file uploads
app.use(express.json({ limit: '256mb' }));
app.use(express.urlencoded({ extended: true, limit: '256mb' }));

app.use(cors({
  origin: ['https://mapacultural.saojosedobonfim.pb.gov.br', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));


// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api', routes);

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error.status === 400) {
    return res.status(400).json({ 
      error: error.message || 'Bad request' 
    });
  }
  
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
