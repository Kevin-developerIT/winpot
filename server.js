const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRouters = require('userRouters');  // Correcta importación de la ruta

// Cargar variables de entorno desde .env
dotenv.config();

// Crear una aplicación Express
const app = express();

// Usar middleware para manejar datos en formato JSON
app.use(bodyParser.json());

// Usar el router de usuarios para las rutas relacionadas con el registro
app.use('/api/users', userRouters);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
