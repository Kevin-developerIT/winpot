const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRouters = require('./userRouters'); // Importar las rutas de usuario

// Cargar las variables de entorno
dotenv.config();

const app = express();

// Middleware para manejar datos JSON
app.use(bodyParser.json());

// Rutas
app.use('/api/users', userRouters);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
