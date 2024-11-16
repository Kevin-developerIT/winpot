const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Configuración de nodemailer (para el envío de correos)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Tu correo de Gmail
    pass: process.env.EMAIL_PASS, // Tu contraseña de Gmail o contraseña de aplicación
  },
});

// Ruta para registrar a un nuevo usuario
router.post('/register', (req, res) => {
  const { firstName, lastName, team, age, email, phone } = req.body;

  // Aquí iría la lógica para guardar los datos en la base de datos
  // Por ahora, simplemente simulo una respuesta exitosa
  console.log('Datos del usuario:', { firstName, lastName, team, age, email, phone });

  // Enviar correo de confirmación
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Registro exitoso',
    text: `Hola ${firstName}, gracias por registrarte en nuestro sistema. ¡Bienvenido!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Error al enviar el correo');
    } else {
      console.log('Correo enviado: ' + info.response);
      return res.status(200).send('Registro exitoso, se ha enviado un correo de confirmación');
    }
  });
});

module.exports = router;
