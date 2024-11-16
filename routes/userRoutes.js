// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de que db.js esté correctamente configurado para la conexión a MySQL

// Ruta para registrar un nuevo usuario
router.post('/register', (req, res) => {
    const { nombre, apellido, correo } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !apellido || !correo) {
        return res.status(400).json({ error: 'Por favor, completa todos los campos.' });
    }

    // Consulta para insertar un nuevo usuario en la base de datos
    const sql = 'INSERT INTO users (nombre, apellido, correo) VALUES (?, ?, ?)';

    // Ejecutar la consulta con los valores del formulario
    db.query(sql, [nombre, apellido, correo], (err, result) => {
        if (err) {
            console.error('Error al registrar el usuario:', err);
            return res.status(500).json({ error: 'Error al registrar el usuario' });
        }
        res.status(200).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });
    });
});

module.exports = router;
