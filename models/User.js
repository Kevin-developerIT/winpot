require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Importar rutas de usuarios
const userRoutes = require('./userRoutes');
app.use('/api/users', userRoutes); // Todas las rutas de usuarios tendrán el prefijo "/api/users"

// Servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
