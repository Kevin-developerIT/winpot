const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const mysql = require('mysql');

// Configuración de la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err.stack);
  } else {
    console.log('Conectado a la base de datos');
  }
});

// Ruta para registrar usuarios
router.post('/register', (req, res) => {
  const { firstName, lastName, team, age, email, phone } = req.body;

  // Insertar en la base de datos
  const query = 'INSERT INTO users (first_name, last_name, team, age, email, phone) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [firstName, lastName, team, age, email, phone], (err, result) => {
    if (err) {
      console.error('Error al insertar en la base de datos:', err);
      return res.status(500).send('Error al registrar usuario');
    }

    // Configuración para enviar el correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Registro exitoso',
      text: `Hola ${firstName}, gracias por registrarte en nuestro sistema. ¡Bienvenido!`,
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error al enviar el correo:', err);
        return res.status(500).send('Usuario registrado, pero ocurrió un error al enviar el correo');
      } else {
        console.log('Correo enviado:', info.response);
        return res.status(200).send('Usuario registrado y correo enviado');
      }
    });
  });
});

module.exports = router;
