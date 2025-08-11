
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Respuesta = require('./models/Respuesta');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/encuesta', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('🟢 Conectado a MongoDB'))
  .catch(err => console.error('❌ Error en conexión MongoDB:', err));

app.post('/api/respuestas', async (req, res) => {
  try {
    const nueva = new Respuesta(req.body);
    await nueva.save();
    res.status(201).json({ mensaje: 'Guardado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar' });
  }
});

app.get('/api/estadisticas', async (req, res) => {
  try {
    const totales = await Respuesta.aggregate([
      { $group: { _id: "$metodo", total: { $sum: 1 } } }
    ]);
    res.json(totales);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
