const mongoose = require('mongoose')

const casosActivosSchema = mongoose.Schema({
  cedula: { type: String},
  apellidos: { type: String},
  nombre: { type: String},
  nacimiento: { type: Date, default: new Date()},
  ingreso: { type: Date, default: new Date()},
  inicio: { type: Date, default: new Date()},
  domicilio: { type: Array},
  señas: { type: String},
  telefono: { type: String},
  alt_alimentacion: { type: String, default: "[No aprobada]"},
  alt_higiene: { type: String, default: "[No aprobada]"}, //Articulos de uso personal e higiene
  alt_salud: { type: String, default: "[No aprobada]"}, //Medicamentos e implementos de salud
  alt_atencion: { type: String, default: "[No aprobada]"}, //Atecion social en salud integral
  alt_apoyo: { type: String, default: "[No aprobada]"}, //Productos de spoyo o ayudas tecnicas
  alt_equipamento: { type: String, default: "[No aprobada]"}, //Equipamento de casa
  alt_alquiler: { type: String, default: "[No aprobada]"}, //Alquiler de vivienda, servicios basicos y municipales
  alt_familias: { type: String, default: "[No aprobada]"}, //Familias solidarias
  alt_asistente: { type: String, default: "[No aprobada]"}, //Asistente domiciliario
  alt_institucionalizacion: { type: String, default: "[No aprobada]"},
  sede: { type: String},
  riesgo: { type: String},
  notas: { type: String},
  files: { type: Array}
})

const casoActivoModel = mongoose.model("activo", casosActivosSchema)
module.exports = casoActivoModel
