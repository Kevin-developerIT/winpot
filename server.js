const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Asegúrate de que la ruta sea correcta
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3001;

// Configuración de CORS
app.use(cors());

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verificar la conexión del transporte
transporter.verify(function (error) {
    if (error) {
        console.error('Error al conectar con el servidor SMTP:', error);
    } else {
        console.log('Servidor de correo listo para enviar mensajes');
    }
});

// Middleware para analizar JSON
app.use(bodyParser.json());

// Endpoint para registrar usuarios
app.post('/register', (req, res) => {
    const { first_name, last_name, team, age, email, phone } = req.body;

    // Validar que todos los campos estén presentes y tengan el formato correcto
    if (!first_name || !last_name || !team || !age || !email || !phone) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Validar formato de email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'El correo electrónico no es válido.' });
    }

    // Validar que la edad sea un número
    if (isNaN(age) || age <= 0) {
        return res.status(400).json({ error: 'La edad debe ser un número positivo.' });
    }

    // Obtener la fecha actual para los campos `createdAt` y `updatedAt`
    const currentDate = new Date().toISOString();

    // Consulta SQL para insertar el usuario
    const query = `
        INSERT INTO users (first_name, last_name, team, age, email, phone)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Ejecutar la consulta
    db.query(query, [first_name, last_name, team, age, email, phone, currentDate, currentDate], (err, result) => {
        if (err) {
            console.error('Error al registrar el usuario:', err);
            return res.status(500).json({ error: 'Error al registrar el usuario.' });
        }

        // Configuración del correo de confirmación
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirmación de registro - WINPOT',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
                    <h2 style="text-align: center; color: #333;">¡Gracias por registrarte, ${first_name}!</h2>
                    <p style="color: #555;">Tu registro ha sido exitoso. Apreciamos que te hayas unido a nosotros.</p>
                    <img src="https://hgroup.consulting/wp-content/uploads/2024/10/invitacion.jpg" alt="Imagen del evento" style="width: 100%; height: auto; border-radius: 5px;">
                    <h3 style="text-align: center; color: #333;">Ubicación del encuentro</h3>
                    <p style="text-align: center; color: #555;">Consulta el siguiente enlace para la ubicación:</p>
                    <p style="text-align: center;">
                        <a href="https://maps.app.goo.gl/1FcABA5NdDyUn1wh8" target="_blank" style="color: #007bff;">Ver en Google Maps</a>
                    </p>
                    <p style="text-align: center; color: #777;">Saludos cordiales,<br/>El equipo Fundación Alsea</p>
                </div>
            `,
        };

        // Enviar el correo
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
                return res.status(500).json({ error: 'Error al enviar el correo de confirmación.' });
            }

            res.status(200).json({ message: 'Registro exitoso y correo enviado.' });
        });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
