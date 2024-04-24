const express = require('express');
const app = express();
const PORT = process.env.PORT || 3333;

// Configuración de rutas y middleware
app.get('/', (req, res) => {
    res.send('¡Hola desde el servidor Express!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});