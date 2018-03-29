const mongoose = require('mongoose')

const casosActivosSchema = mongoose.Schema({
  cedula: { type: String},
  apellidos: { type: String},
  nombre: { type: String},
  sexo: { type: String},
  nacimiento: { type: Date, default: new Date()},
  ingreso: { type: Date, default: new Date()},
  domicilio: { type: Array},
  señas: { type: String},
  telefono: { type: String},
  alternativas: { type: Array},
  sede: { type: String},
  riesgo: { type: String},
  notas: { type: String},
})

const casoActivoModel = mongoose.model("activo", casosActivosSchema)
module.exports = casoActivoModel
