const MDF = "Modificador"
const ADM = "Administrador"
const EPR = "Espera"

const usuarios = [ADM]
const ESP_VIS_CRUD = [ADM,EPR,MDF]
const ESP_VIS_ACEP = [ADM,MDF]
const LIST_CRUD = [ADM,MDF]

export function accessUsuario(type){
    return usuarios.indexOf(type)>=0
}

export function accessESPVISCRUD(type){
    return ESP_VIS_CRUD.indexOf(type)<0
}
export function accessESPVISACEP(type){
    return ESP_VIS_ACEP.indexOf(type)<0
}
export function accessGENLIST(type){
    return LIST_CRUD.indexOf(type)<0
}