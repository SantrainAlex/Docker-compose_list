const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, initDatabase } = require('./config/database');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8090',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API User Management' });
});

app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route non trouvée',
    method: req.method,
    path: req.path
  });
});

app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).json({
    message: 'Erreur interne du serveur',
    error: err.message
  });
});

async function startServer() {
  try {
    await initDatabase();
    await sequelize.sync();
    
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données:', error);
  }
}

startServer();
