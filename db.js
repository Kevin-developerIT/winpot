const mysql = require('mysql');

// Crear un pool de conexiones
const pool = mysql.createPool({
    host: '193.203.166.181',        // O la IP o URL de tu servidor de base de datos
    user: 'u943042028_appreg',       // Usuario de la base de datos
    password: 'Registro20.2522',  // Contraseña del usuario
    database: 'u943042028_registrar', // Asegúrate de especificar la base de datos aquí
    connectionLimit: 10       // Puedes ajustar este número
  });

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Conexión con la base de datos cerrada.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Demasiadas conexiones en la base de datos.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Conexión a la base de datos rechazada.');
        }
    }

    if (connection) connection.release();
    return;
});

module.exports = pool;
