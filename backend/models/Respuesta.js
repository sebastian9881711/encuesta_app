
const mongoose = require('mongoose');

const RespuestaSchema = new mongoose.Schema({
  nombre: String,
  dni: String,
  correo: String,
  metodo: String,
  frecuencia: String,
  dificultad: String,
  detalle_dificultad: String,
  factores: [String],
  adoptar: String,
  comentarios: String,
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Respuesta', RespuestaSchema);
