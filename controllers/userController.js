const db = require('../db');

// Registro de usuario
exports.registerUser = (req, res) => {
  const { firstName, lastName, team, age, email, phone } = req.body;

 // Insertar en la base de datos
 const query = 'INSERT INTO users (first_name, last_name, team, age, email, phone) VALUES (?, ?, ?, ?, ?, ?)';
 db.query(query, [firstName, lastName, team, age, email, phone], (err, result) => {
    if (err) {
      res.status(500).send({ message: 'Error al registrar usuario' });
    } else {
      res.status(201).send({ message: 'Usuario registrado correctamente' });
    }
  });
};
