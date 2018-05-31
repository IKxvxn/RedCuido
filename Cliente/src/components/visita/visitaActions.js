import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

//Se definen las variables utilizadas en reducer que definen las acciones
const NEW_VISITA_REQUEST = 'NEW_VISITA_REQUEST'
const NEW_VISITA_SUCCESS = 'NEW_VISITA_SUCCESS'
const NEW_VISITA_FAILURE = 'NEW_VISITA_FAILURE'
const GET_VISITA_REQUEST = 'GET_VISITA_REQUEST'
const GET_VISITA_SUCCESS = 'GET_VISITA_SUCCESS'
const GET_VISITA_FAILURE = 'GET_VISITA_FAILURE'
const EDIT_VISITA_REQUEST = 'EDIT_VISITA_REQUEST'
const EDIT_VISITA_SUCCESS = 'EDIT_VISITA_SUCCESS'
const EDIT_VISITA_FAILURE = 'EDIT_VISITA_FAILURE'
const ACCEPT_VISITA_REQUEST = 'ACCEPT_VISITA_REQUEST'
const ACCEPT_VISITA_SUCCESS = 'ACCEPT_VISITA_SUCCESS'
const ACCEPT_VISITA_FAILURE = 'ACCEPT_VISITA_FAILURE'
const REJECT_VISITA_REQUEST = 'REJECT_VISITA_REQUEST'
const REJECT_VISITA_SUCCESS = 'REJECT_VISITA_SUCCESS'
const REJECT_VISITA_FAILURE = 'REJECT_VISITA_FAILURE'
const DELETE_VISITA_REQUEST = 'DELETE_VISITA_REQUEST'
const DELETE_VISITA_SUCCESS = 'DELETE_VISITA_SUCCESS'
const DELETE_VISITA_FAILURE = 'DELETE_VISITA_FAILURE'
const DOWNLOAD_FILE_REQUEST = 'DOWNLOAD_FILE_REQUEST'
const DOWNLOAD_FILE_SUCCESS = 'DOWNLOAD_FILE_SUCCESS'
//const DOWNLOAD_FILE_FAILURE = 'DOWNLOAD_FILE_FAILURE'
const DELETE_FILES_REQUEST = 'DELETE_VISITA_REQUEST'
const DELETE_FILES_SUCCESS = 'DELETE_VISITA_SUCCESS'
const DELETE_FILES_FAILURE = 'DELETE_VISITA_FAILURE'

//Funcion que crea el perfil de visita
export function createCaso(data, reset) {
  return function (dispatch) {
    dispatch({
      type: NEW_VISITA_REQUEST
    })
    //Manda la informacion al servidor
    fetch(API_URL + "/visita/casoVisita", {
      method: 'POST',
      body: data
    })
      .then(response => response.json())
      .then(caso => {
        if(caso.error){
          //Posibles errores
          if(caso.type===0){
            message.error(Mensajes.sinToken)
          }
          else if (caso.type===1){
            message.error(Mensajes.tokenExpiro)
          }
          else{
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({type: NEW_VISITA_FAILURE})
        }
        else{
          //El perfil fue creado exitosamente
          dispatch({
            type: NEW_VISITA_SUCCESS,
            caso: { ...caso.caso, key: caso.caso._id }
          })
          message.success("El perfil ha sido postulado con éxito")
          reset()
        }
      })
      .catch(error => {
        //Existio un error en el servidor
        message.error(Mensajes.errorConexion)
        dispatch({
          type: NEW_VISITA_FAILURE,
          error: error
        })
      })
  }
}

//Funcion que obtiene todos los casos de visita
export function getCasos(usuario) {
  return function (dispatch) {
    dispatch({
      type: GET_VISITA_REQUEST
    })
    //Hace la peticion al servidor
    fetch(API_URL + "/visita?token="+usuario.token)
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.casos.length; i++) {
          data.casos[i].key = data.casos[i]._id
        }
        return data.casos;
      }).then(casos => {
        //Obtencion exitosa
        dispatch({
          type: GET_VISITA_SUCCESS,
          casosVisita: casos
        })
      })
      .catch(error => {
        //Error en servidor
        dispatch({
          type: GET_VISITA_FAILURE,
          error: error
        })
      })
  }
}

//Funcion que edita un caso de visita
export function editCaso(caso) {
  return function (dispatch) {
    dispatch({
      type: EDIT_VISITA_REQUEST
    })
    //Se hace la peticion al servidor y se mandan los datos
    var variable = caso.get("caso")
    variable = JSON.parse(variable)
    fetch(`${API_URL}/visita/edit/${variable._id.valueOf()}`, {
      method: 'PUT',
      body: caso,
    })
      .then(response => response.json())
      .then(data => {
        if(data.error){
          //Posibles errores
          if(data.type===0){
            message.error(Mensajes.sinToken)
          }
          else if (data.type===1){
            message.error(Mensajes.tokenExpiro)
          }
          else{
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({type: EDIT_VISITA_FAILURE})
        }
        else{
          //El perfil fue modificado exitosamente
          dispatch({
            type: EDIT_VISITA_SUCCESS,
            caso: { ...data.caso, key: data.caso._id }
          })
          message.success("El perfil ha sido modificado con éxito")
        }
      })
      .catch(error => {
        //Existio un error en servidor
        dispatch({
          type: EDIT_VISITA_FAILURE,
          error: error
        })
        message.error(Mensajes.errorConexion)
      })
  }
}

//Funcion que descarga los archivos de un perfil de visita
export function downloadFile(caso) {
  return function (dispatch) {
    dispatch({
      type: DOWNLOAD_FILE_REQUEST
    })
    window.open(API_URL + `/visita/download/${caso._id.valueOf()}`)
    dispatch({
      type: DOWNLOAD_FILE_SUCCESS,
    })
  }
}

//Funcion que pasa el perfil de visita a lista de activos
export function acceptCaso(caso, nota, usuario) {
  return function (dispatch) {
    dispatch({
      type: ACCEPT_VISITA_REQUEST
    })
    //Se hace la peticion al servidor
    fetch(`${API_URL}/visita/accept/${caso._id.valueOf()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caso: caso, nota: nota, usuario:usuario }),
    })
      .then(response => response.json())
      .then(data => {
        //Errores posibles
        if(data.error){
          if(data.type===0){
            message.error(Mensajes.sinToken)
          }
          else if (data.type===1){
            message.error(Mensajes.tokenExpiro)
          }
          else{
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({type: ACCEPT_VISITA_FAILURE})
        }
        else{
          //El caso fue aceptado exitosamente
          dispatch({
            type: ACCEPT_VISITA_SUCCESS,
            id: caso._id
          })
          message.success("El perfil ha sido aceptado con éxito")
        }
      })
      .catch(error => {
        //Error en servidor
        dispatch({
          type: ACCEPT_VISITA_FAILURE,
          error: error
        })
        message.error(Mensajes.errorConexion)
      })
  }
}

//Funcion que pasa el perfil de lista de visita a lista de rechazados
export function rejectCaso(caso, nota, usuario) {
  return function (dispatch) {
    dispatch({
      type: REJECT_VISITA_REQUEST
    })
    //Peticion del servidor
    fetch(`${API_URL}/visita/reject/${caso._id.valueOf()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caso: caso, nota: nota, usuario:usuario }),
    })
      .then(response => response.json())
      .then(data => {
        //Posibles errores
        if(data.error){
          if(data.type===0){
            message.error(Mensajes.sinToken)
          }
          else if (data.type===1){
            message.error(Mensajes.tokenExpiro)
          }
          else{
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({type: REJECT_VISITA_FAILURE})
        }
        else{
          //Rechazo exitoso
          dispatch({
            type: REJECT_VISITA_SUCCESS,
            id: caso._id
          })
          message.success("El perfil ha sido rechazado con éxito")
        }
      })
      .catch(error => {
        //Error en servidor
        dispatch({
          type: REJECT_VISITA_FAILURE,
          error: error
        })
        message.error(Mensajes.errorConexion)
      })
  }
}

//Funcion que elimina el perfil
export function deleteCaso(caso, nota, usuario) {
  return function (dispatch) {
  dispatch({
    type: DELETE_VISITA_REQUEST
  })
  //Se hace peticion al servidor
  fetch(`${API_URL}/visita/delete/${caso._id.valueOf()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({caso:caso, nota:nota, usuario:usuario}),
  })
    .then(response => response.json())
    .then(data => {
      //Posibles errores
      if(data.error){
        if(data.type===0){
          message.error(Mensajes.sinToken)
        }
        else if (data.type===1){
          message.error(Mensajes.tokenExpiro)
        }
        else{
          message.error(Mensajes.errorDesconocido)
        }
        dispatch({type: DELETE_VISITA_FAILURE})
      }
      else{
        //Eliminacion exitosa
        dispatch({
          type: DELETE_VISITA_SUCCESS,
          id: caso._id
        })
        message.success("El caso ha sido eliminado con éxito")
      }
    })
    .catch(error => {
      dispatch({
        //Error en servidor
        type: DELETE_VISITA_FAILURE,
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}
}

//Funcion que elimina archivos del perfil
export function deleteFiles(files) {
  return function (dispatch) {
    dispatch({
      type: DELETE_FILES_REQUEST
    })
    //Se hace la peticion al servidor
    fetch(`${API_URL}/eliminar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({files:files}),
    })
      .then(response => response.json())
      .then(data => {
        //Posibles errores
        if (data.error) {
          if (data.type === 0) {
            message.error(Mensajes.sinToken)
          }
          else if (data.type === 1) {
            message.error(Mensajes.tokenExpiro)
          }
          else {
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({ type: DELETE_FILES_FAILURE })
        }
        else {
          //Eliminacion exitosa
          dispatch({
            type: DELETE_FILES_SUCCESS
          })
        }
      })
      .catch(error => {
        dispatch({
          //Error en servidor
          type: DELETE_FILES_FAILURE,
          error: error
        })
        message.error(Mensajes.errorConexion)
      })
  }
}