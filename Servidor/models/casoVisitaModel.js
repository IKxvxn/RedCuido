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
  riesgo: { type: String},
  notas: { type: String},
  files: { type: Array}
})

const casoVisitaModel = mongoose.model("visita", casosVisitaSchema)
module.exports = casoVisitaModel
