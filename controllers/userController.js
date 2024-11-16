const db = require('../db');

// Registro de usuario
exports.registerUser = (req, res) => {
  const { first_name, last_name, email } = req.body;

  // Insertar en la base de datos
  const query = 'INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?)';
  db.query(query, [first_name, last_name, email], (err, result) => {
    if (err) {
      res.status(500).send({ message: 'Error al registrar usuario' });
    } else {
      res.status(201).send({ message: 'Usuario registrado correctamente' });
    }
  });
};
