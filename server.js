const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Asegúrate de que la ruta sea correcta
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3001;

const cors = require('cors');

// Permitir todas las solicitudes CORS (útil para desarrollo)
app.use(cors());

// O, si prefieres permitir solo un origen específico, haz esto:
app.use(cors({
    origin: 'https://coctel-cena-registro.hgroup.consulting'
}));


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'contactoregistro2@gmail.com',
        pass: 'fgpnsxaoamuffixq'
    }
});

// Verificar la conexión del transporte
transporter.verify(function (error, success) {
    if (error) {
        console.log('Error al conectar con el servidor SMTP:', error);
    } else {
        console.log('Servidor de correo listo para enviar mensajes');
    }
});



app.use(bodyParser.json()); // Para analizar JSON en el cuerpo de la solicitud

// Endpoint para registrar usuarios
app.post('/register', (req, res) => {
    const { nombre, apellido, correo } = req.body;

    // Verificar que todos los campos estén presentes
    if (!nombre || !apellido || !correo) {
        return res.status(400).send('Todos los campos son obligatorios.');
    }

    const query = 'INSERT INTO users (nombre, apellido, correo) VALUES (?, ?, ?)';

    db.query(query, [nombre, apellido, correo], (err) => {
        if (err) {
            console.error('Error al registrar el usuario:', err);
            return res.status(500).send('Error al registrar el usuario.');
        }

        // Aquí puedes enviar el correo de confirmación
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: correo,
            subject: 'Confirmación de registro - Cena de celebración Fundación Alsea',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #333;">¡Gracias por registrarte, ${nombre}!</h2>
            <p style="color: #555;">Tu registro ha sido exitoso. Apreciamos que te hayas unido a nosotros.</p>

            <!-- Imagen del evento -->
            
            <img src="https://hgroup.consulting/wp-content/uploads/2024/10/invitacion.jpg" alt="Imagen del evento" style="width: 100%; height: auto; border-radius: 5px;">
            
            <!-- Localización del evento -->
            <h3 style="text-align: center; color: #333;">Ubicación del encuentro</h3>
            <p style="text-align: center; color: #555;">Consulta el siguiente enlace para la ubicación:</p>
            <p style="text-align: center;">
                <a href="https://maps.app.goo.gl/1FcABA5NdDyUn1wh8" target="_blank" style="color: #007bff;">Ver en Google Maps</a>
            </p>

            <p style="text-align: center; color: #777;">Saludos cordiales,<br/>El equipo Fundación Alsea</p>
        </div>
    `,
       

    };

    // Enviar correo
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).send('Error al enviar el correo de confirmación.');
        }

        res.status(200).send('Registro exitoso y correo enviado.');
    });
});
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
