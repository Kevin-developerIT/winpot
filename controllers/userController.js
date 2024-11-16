const db = require('../db'); // Asegúrate de que la conexión esté correctamente configurada

// Registro de usuario
exports.registerUser = (req, res) => {
  const { firstName, lastName, team, age, email, phone } = req.body;

  // Validar que todos los campos estén presentes
  if (!firstName || !lastName || !team || !age || !email || !phone) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  // Validar que la edad sea un número
  if (isNaN(age)) {
    return res.status(400).json({ error: 'La edad debe ser un número válido.' });
  }

  // Validar formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'El correo electrónico no tiene un formato válido.' });
  }

  // Consulta SQL para insertar un usuario
  const query = `
    INSERT INTO Users (first_name, last_name, team, age, email, phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Ejecutar la consulta
  db.query(query, [firstName, lastName, team, age, email, phone], (err, result) => {
    if (err) {
      console.error('Error al registrar el usuario:', err);
      return res.status(500).json({ error: 'Ocurrió un error al registrar el usuario.' });
    }

    // Respuesta exitosa
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      userId: result.insertId,
    });
  });
};
