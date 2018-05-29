const mongoose = require('mongoose')

const casosEsperaSchema = mongoose.Schema({
  cedula: { type: String},
  apellidos: { type: String},
  nombre: { type: String},
  domicilio: { type: Array},
  señas: { type: String},
  telefono: { type: String},
  ingreso: { type: Date, default: new Date()},
  nacimiento: { type: Date, default: new Date()},
  p_vivienda: { type: String},
  p_alimento: { type: String},
  p_economico: { type: String},
  p_vive_solo: { type: String},
  p_otros: { type: String},
  sede: { type: String},
  prioridad: { type: String},
  notas: { type: String},
  files: { type: Array}
})

const casoEsperaModel = mongoose.model("espera", casosEsperaSchema)
module.exports = casoEsperaModel
