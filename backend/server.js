const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Respuesta = require('./models/Respuesta');

const app = express();
const PORT = 3000;

// Middlewares (orden importante)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para formularios HTML


// Conexión MongoDB Atlas (igual que antes)
mongoose.connect(
  'mongodb+srv://david365dgxd:999389067C@cluster0.k2moabg.mongodb.net/encuesta?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log('🟢 Conectado a MongoDB Atlas'))
 .catch(err => console.error('❌ Error en conexión MongoDB:', err));

// Archivos estáticos (debe estar después de los middlewares)
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas API
app.post('/api/respuestas', async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body); // Para depuración
    const nueva = new Respuesta(req.body);
    await nueva.save();
    res.status(201).json({ mensaje: 'Guardado' });
  } catch (err) {
    console.error('Error al guardar:', err);
    res.status(500).json({ 
      error: 'Error al guardar',
      detalle: err.message
    });
  }
});

// Otras rutas...
app.get('/api/estadisticas', async (req, res) => { /* ... */ });

// Ruta para SPA (debe ir al final)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend',));
});

app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));

// Obtener estadísticas generales
app.get('/api/estadisticas', async (req, res) => {
  try {
    const estadisticas = {
      metodos: await Respuesta.aggregate([
        { $group: { _id: "$metodo", total: { $sum: 1 } } }
      ]),
      dificultades: await Respuesta.aggregate([
        { $group: { _id: "$dificultad", total: { $sum: 1 } } }
      ]),
      factores: await Respuesta.aggregate([
        { $unwind: "$factores" },
        { $group: { _id: "$factores", total: { $sum: 1 } } }
      ])
    };
    res.json(estadisticas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Filtrado por campo específico (ej: /api/estadisticas/metodo)
app.get('/api/estadisticas/:campo', async (req, res) => {
  try {
    const { campo } = req.params;
    const datos = await Respuesta.aggregate([
      { $group: { _id: `$${campo}`, total: { $sum: 1 } } }
    ]);
    res.json(datos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});