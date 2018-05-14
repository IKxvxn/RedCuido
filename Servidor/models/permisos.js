const CST = "Consultor"
const MDF = "Modificador"
const ADM = "Administrador"
const EPR = "Espera"

const usuarios = [ADM]
const ESP_VIS_CRUD = [ADM,EPR,MDF]
const ESP_VIS_ACEP = [ADM,MDF]
const LIST_CRUD = [ADM,MDF]

module.exports = {usuarios,ESP_VIS_CRUD,ESP_VIS_ACEP,LIST_CRUD}