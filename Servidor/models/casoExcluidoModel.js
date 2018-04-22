const mongoose = require('mongoose')

const casosExcluidoSchema = mongoose.Schema({
  cedula: { type: String},
  apellidos: { type: String},
  nombre: { type: String},
  domicilio: { type: Array},
  señas: { type: String},
  telefono: { type: String},
  ingreso: { type: Date, default: new Date()},
  nacimiento: { type: Date, default: new Date()},
  inicio: { type: Date, default: new Date()},
  exclusion: { type: Date, default: new Date()},
  altv_aprobadas: { type: Array},
  sede: { type: String},
  notas: { type: String},
})

const casoExcluidoModel = mongoose.model("excluido", casosExcluidoSchema)
module.exports = casoExcluidoModel
