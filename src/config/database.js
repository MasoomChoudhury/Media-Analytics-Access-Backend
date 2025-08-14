const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (isProduction) {
  // PostgreSQL for Production
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for some cloud providers
      },
    },
    logging: false,
  });
} else {
  // SQLite for Development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './dev-database.sqlite',
    logging: console.log,
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    // Sync all models. Using { force: true } in development will drop and recreate tables.
    await sequelize.sync({ force: !isProduction });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { sequelize, connectDB };
