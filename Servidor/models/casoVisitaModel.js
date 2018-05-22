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
  alt_alimentacion: { type: String},
  alt_higiene: { type: String}, //Articulos de uso personal e higiene
  alt_salud: { type: String}, //Medicamentos e implementos de salud
  alt_atencion: { type: String}, //Atencion social en salud integral
  alt_apoyo: { type: String}, //Productos de apoyo o ayudas tecnicas
  alt_equipamento: { type: String}, //Equipamento de casa
  alt_alquiler: { type: String}, //Alquiler de vivienda, servicios basicos y municipales
  alt_familias: { type: String}, //Familias solidarias
  alt_asistente: { type: String}, //Asistente domiciliario
  alt_institucionalizacion: { type: String},
  riesgo: { type: String},
  notas: { type: String},
  files: { type: Array}
})

const casoVisitaModel = mongoose.model("visita", casosVisitaSchema)
module.exports = casoVisitaModel
