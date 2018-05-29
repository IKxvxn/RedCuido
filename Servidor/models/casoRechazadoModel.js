const mongoose = require('mongoose')

const casosRechazadoSchema = mongoose.Schema({
  cedula: { type: String},
  apellidos: { type: String},
  nombre: { type: String},
  domicilio: { type: Array},
  señas: { type: String},
  telefono: { type: String},
  ingreso: { type: Date, default: new Date()},
  rechazo: { type: Date, default: new Date()},
  nacimiento: { type: Date, default: new Date()},
  sede: { type: String},
  notas: { type: String},
  files: { type: Array}
})

const casoRechazadoModel = mongoose.model("rechazado", casosRechazadoSchema)
module.exports = casoRechazadoModel
