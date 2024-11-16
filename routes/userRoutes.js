const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

// Configuración de la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Ruta para registrar un usuario
router.post('/register', (req, res) => {
  const { nombre, apellido, equipo, edad, email, telefono } = req.body;

  // Validar datos
  if (!nombre || !apellido || !equipo || !edad || !email || !telefono) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  // Insertar usuario en la base de datos
  const query = `INSERT INTO users (nombre, apellido, equipo, edad, email, telefono) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [nombre, apellido, equipo, edad, email, telefono], async (err, result) => {
    if (err) {
      console.error('Error al registrar usuario:', err);
      return res.status(500).json({ message: 'Error al registrar el usuario.' });
    }

    // Opciones del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Registro exitoso',
      text: `Hola ${nombre}, gracias por registrarte con el equipo ${equipo}. ¡Bienvenido!`,
    };

    try {
      // Enviar correo
      await transporter.sendMail(mailOptions);
      console.log('Correo enviado con éxito.');

      res.status(201).json({ message: 'Usuario registrado y correo enviado con éxito.' });
    } catch (error) {
      console.error('Error enviando el correo:', error);
      res.status(500).json({ message: 'Usuario registrado, pero hubo un problema enviando el correo.' });
    }
  });
});

module.exports = router;
