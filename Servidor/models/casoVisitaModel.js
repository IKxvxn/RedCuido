const mongoose = require('mongoose')

const casosVisitaSchema = mongoose.Schema({
  cedula: { type: String},
  apellidos: { type: String},
  nombre: { type: String},
  domicilio: { type: Array},
  señas: { type: String},
  telefono: { type: String},
  ingreso: { type: Date, default: new Date()},
  nacimiento: { type: Date, default: new Date()},
  problemas: { type: Array},
  sede: { type: String},
  prioridad: { type: String},
  alternativas: { type: Array},
  riesgo: { type: String},
  notas: { type: String},
  files: { type: Array}
})

const casoVisitaModel = mongoose.model("visita", casosVisitaSchema)
module.exports = casoVisitaModel
