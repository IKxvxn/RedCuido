const mongoose = require('mongoose')

const usuariosSchema = mongoose.Schema({
  datos: { type: String, default: "Acá hay que agregar los demás campos, dejé esto así para trabajar en las notificaciones"},
  notificaciones: { type: Array, default: []},
})

const usuariosModel = mongoose.model("usuario", usuariosSchema)
module.exports = usuariosModel
