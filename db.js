const mysql = require('mysql');

// Crear un pool de conexiones con configuración desde variables de entorno
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  connectionLimit: 10, // Límite de conexiones en el pool
  waitForConnections: true, // Esperar conexiones en lugar de rechazar
  queueLimit: 0, // Sin límite en la cola de conexiones
  multipleStatements: false, // Seguridad: Desactivar múltiples declaraciones
});

// Manejo de errores al inicializar la conexión
pool.on('connection', () => {
  console.log('Conexión establecida con la base de datos.');
});

pool.on('acquire', (connection) => {
  console.log(`Conexión adquirida: ID ${connection.threadId}`);
});

pool.on('release', (connection) => {
  console.log(`Conexión liberada: ID ${connection.threadId}`);
});

// Verificar conexión al iniciar el servicio
pool.getConnection((err, connection) => {
  if (err) {
    switch (err.code) {
      case 'PROTOCOL_CONNECTION_LOST':
        console.error('Conexión con la base de datos cerrada.');
        break;
      case 'ER_CON_COUNT_ERROR':
        console.error('Demasiadas conexiones en la base de datos.');
        break;
      case 'ECONNREFUSED':
        console.error('Conexión a la base de datos rechazada.');
        break;
      default:
        console.error('Error desconocido en la conexión:', err.message);
    }
  }

  if (connection) {
    console.log('Conexión inicial exitosa.');
    connection.release(); // Liberar la conexión inicial
  }
});

// Exportar el pool para reutilizarlo en el proyecto
module.exports = pool;
