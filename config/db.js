const { Sequelize } = require('sequelize');

// Configurar conexión a MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

// Verificar conexión
sequelize
  .authenticate()
  .then(() => console.log('Conexión exitosa a MySQL'))
  .catch((err) => console.error('Error al conectar a MySQL:', err));

module.exports = sequelize;
