const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa el módulo cors
const adminRouter = require('./routes/admin');
const recipeRouter = require('./routes/recipe');
const userRouter = require('./routes/user');
const Admin = require('./models/admin');
const Recipe = require('./models/recipe');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3333;
// ####################
// Configura multer para guardar archivos en 'uploads/'
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
//   });
  
//   const upload = multer({ storage: storage });
// ####################

// Middleware para el uso de JSON
app.use(express.json());

// Habilita CORS para todas las solicitudes
app.use(cors());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/ch33f', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => console.log('Conexión exitosa a MongoDB'));

// Rutas
app.use(adminRouter);
app.use(recipeRouter);
app.use(userRouter);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Hola desde el servidor Express!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
