const mongoose = require('mongoose')

const usuariosSchema = mongoose.Schema({
  _id: {type: String},
  cedula: {type: String},
  nombre: {type: String},
  ingreso: {type: Date, default: new Date()},
  telefono: {type: String},
  correo: {type: String},
  tipo: { type: String, default:"0"},
  institucion: {type: String},
  contraseña: {type: String},
  notificaciones: { type: Array, default: []},
})

const usuariosModel = mongoose.model("usuario", usuariosSchema)
module.exports = usuariosModel
