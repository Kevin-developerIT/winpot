const express = require('express');
const router = express.Router();
const db = require('../db'); // Verifica que la conexión a MySQL esté correctamente configurada

// Ruta para registrar un nuevo usuario
router.post('/register', (req, res) => {
    const { first_name, last_name, team, age, email, phone } = req.body;

    // Validar que todos los campos estén presentes
    if (!first_name || !last_name || !team || !age || !email || !phone) {
        return res.status(400).json({ error: 'Por favor, completa todos los campos.' });
    }

    // Validar que la edad sea un número
    if (isNaN(age)) {
        return res.status(400).json({ error: 'La edad debe ser un número.' });
    }

    // Validar formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Por favor, introduce un correo válido.' });
    }

    // Consulta SQL para insertar un nuevo usuario en la base de datos
    const sql = `
        INSERT INTO Users (first_name, last_name, team, age, email, phone)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Ejecutar la consulta con los valores del formulario
    db.query(sql, [first_name, last_name, team, age, email, phone], (err, result) => {
        if (err) {
            console.error('Error al registrar el usuario:', err);
            return res.status(500).json({ error: 'Error al registrar el usuario.' });
        }

        // Responder con un mensaje de éxito y el ID del usuario registrado
        res.status(200).json({
            message: 'Usuario registrado exitosamente',
            userId: result.insertId,
        });
    });
});

module.exports = router;
