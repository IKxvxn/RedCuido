const mongoose = require('mongoose')

const usuariosSchema = mongoose.Schema({
  _id: {type: String},
  tipo: { type: String, default:"0"},
  ingreso: {type: Date, default: new Date()},
  nombre: {type: String},
  contraseña: {type: String},
  notificaciones: { type: Array, default: []},
})

const usuariosModel = mongoose.model("usuario", usuariosSchema)
module.exports = usuariosModel
