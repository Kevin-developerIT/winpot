const mysql = require('mysql2'); // Usamos mysql2 para la conexión
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Para manejar variables de entorno

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Configuración de la conexión MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // Coloca tus credenciales aquí
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
});

// Manejo de errores de conexión
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

// API Rest para registrar usuario
app.post('/register', (req, res) => {
  const { firstName, lastName, team, age, email, phone } = req.body;

  // Verificamos si los datos son válidos
  if (!firstName || !lastName || !team || !age || !email || !phone) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Consulta SQL para insertar el nuevo registro en la base de datos
  const query = 'INSERT INTO users (first_name, last_name, team, age, email, phone) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [firstName, lastName, team, age, email, phone];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al registrar el usuario:', err);
      return res.status(500).json({ error: 'Error al registrar el usuario' });
    }

    // Enviar correo de confirmación
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Registro exitoso',
      text: `Hola ${firstName}, gracias por registrarte en el equipo ${team}. ¡Bienvenido!`,
      html: `
        <h1>Bienvenido, ${firstName} ${lastName}</h1>
        <p>Gracias por registrarte. Tu inscripción al equipo ${team} ha sido exitosa.</p>
        <p>Edad: ${age}</p>
        <p>Email: ${email}</p>
        <p>Teléfono: ${phone}</p>
        <img src="cid:logo" alt="Logo" />
      `,
      attachments: [
        {
          filename: 'logo.png',
          path: 'path/to/logo.png', // Reemplaza con la ruta correcta de tu logo
          cid: 'logo' // ID del contenido que será referenciado en el HTML
        }
      ]
    };

    // Enviar el correo
    sendConfirmationEmail(mailOptions, (err) => {
      if (err) {
        console.error('Error al enviar el correo de confirmación:', err);
        return res.status(500).json({ error: 'Error al enviar el correo de confirmación' });
      }

      res.status(200).json({ message: 'Registro exitoso, correo enviado' });
    });
  });
});

// Función para enviar el correo de confirmación
const sendConfirmationEmail = (mailOptions, callback) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      callback(err);
    } else {
      console.log('Correo de confirmación enviado:', info.response);
      callback(null);
    }
  });
};

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
