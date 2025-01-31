const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'mariadb',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 10,
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /SQLConnectError/
    ],
    backoffBase: 1000,
    backoffExponent: 1.5,
  }
});

const initDatabase = async () => {
  let retries = 10;
  const retryInterval = 5000;

  while (retries) {
    try {
      console.log('Tentative de connexion à la base de données...');
      await sequelize.authenticate();
      console.log('Connexion à la base de données établie avec succès.');
      await sequelize.sync({ force: false });
      return sequelize;
    } catch (error) {
      console.log(`Tentative de connexion échouée. Tentatives restantes: ${retries}`);
      retries -= 1;
      if (retries === 0) {
        console.error('Impossible de se connecter à la base de données:', error);
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
  }
};

module.exports = {
  sequelize,
  initDatabase
};
