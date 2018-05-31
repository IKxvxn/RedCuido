import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

//variables dedicadas a acciones del reducer
const NEW_EXCLUIDO_REQUEST = 'NEW_EXCLUIDO_REQUEST'
const NEW_EXCLUIDO_SUCCESS = 'NEW_EXCLUIDO_SUCCESS'
const NEW_EXCLUIDO_FAILURE = 'NEW_EXCLUIDO_FAILURE'
const GET_EXCLUIDOS_REQUEST = 'GET_EXCLUIDOS_REQUEST'
const GET_EXCLUIDOS_SUCCESS = 'GET_EXCLUIDOS_SUCCESS'
const GET_EXCLUIDOS_FAILURE = 'GET_EXCLUIDOS_FAILURE'
const EDIT_EXCLUIDO_REQUEST = 'EDIT_EXCLUIDO_REQUEST'
const EDIT_EXCLUIDO_SUCCESS = 'EDIT_EXCLUIDO_SUCCESS'
const EDIT_EXCLUIDO_FAILURE = 'EDIT_EXCLUIDO_FAILURE'
const DELETE_EXCLUIDO_REQUEST = 'DELETE_EXCLUIDO_REQUEST'
const DELETE_EXCLUIDO_SUCCESS = 'DELETE_EXCLUIDO_SUCCESS'
const DELETE_EXCLUIDO_FAILURE = 'DELETE_EXCLUIDO_FAILURE'
const REACTIVATE_EXCLUIDO_REQUEST = 'REACTIVATE_EXCLUIDO_REQUEST'
const REACTIVATE_EXCLUIDO_SUCCESS = 'REACTIVATE_EXCLUIDO_SUCCESS'
const REACTIVATE_EXCLUIDO_FAILURE = 'REACTIVATE_EXCLUIDO_FAILURE'
const DOWNLOAD_FILE_REQUEST = 'DOWNLOAD_FILE_REQUEST'
const DOWNLOAD_FILE_SUCCESS = 'DOWNLOAD_FILE_SUCCESS'
//const DOWNLOAD_FILE_FAILURE = 'DOWNLOAD_FILE_FAILURE'
const DELETE_FILES_REQUEST = 'DELETE_FILES_REQUEST'
const DELETE_FILES_SUCCESS = 'DELETE_FILES_SUCCESS'
const DELETE_FILES_FAILURE = 'DELETE_FILES_FAILURE'

//funcion encargada de crear un perfil de excluidos
export function createCaso(caso, reset) {
  return function (dispatch) {
    dispatch({
      type: NEW_EXCLUIDO_REQUEST
    })
    //se comunica con el servidor
    fetch(API_URL + "/casoExcluido", {
      method: 'POST',
      body: caso,
    })
      .then(response => response.json())
      .then(caso => {
        if(caso.error){
          //tipos de casos
          if(caso.type===0){
            message.error(Mensajes.sinToken)
          }
          else if (caso.type===1){
            message.error(Mensajes.tokenExpiro)
          }
          else{
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({type: NEW_EXCLUIDO_FAILURE})//error
        }
        else{
        message.success("El perfil ha sido agregado con éxito")
          reset()
          dispatch({
            type: NEW_EXCLUIDO_SUCCESS,//exito
            caso: { ...caso.caso, key: caso.caso._id }
          })
        }
      })
      .catch(error => {
        message.error(Mensajes.errorConexion)
        dispatch({
          type: NEW_EXCLUIDO_FAILURE,//error
          error: error
        })
      })
  }
}

//funcion para obtener todos los perfiles de lista excluidos
export function getCasos(usuario) {
  return function (dispatch) {
    dispatch({
      type: GET_EXCLUIDOS_REQUEST
    })
    //se comunica con el servidor
    fetch(API_URL + "/casoExcluido?token="+usuario.token)
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.casos.length; i++) {
          data.casos[i].key = data.casos[i]._id
        }
        return data.casos;
      }).then(casos => {
        dispatch({
          type: GET_EXCLUIDOS_SUCCESS,//exito
          casosExcluidos: casos
        })
      })
      .catch(error => {
        dispatch({
          type: GET_EXCLUIDOS_FAILURE,//error
          error: error
        })
      })
  }
}

//funcion encargada de descargar los archivos de un perfil
export function downloadFile(caso) {
  return function (dispatch) {
    dispatch({
      type: DOWNLOAD_FILE_REQUEST
    })
    //abre una nueva ventana para descargar archivo 
    window.open(API_URL + `/excluido/download/${caso._id.valueOf()}`)
    dispatch({
      type: DOWNLOAD_FILE_SUCCESS,//exito
    })
  }
}

//funcion encargada de editar el perfil
export function editCaso(caso) {
  return function (dispatch) {
    dispatch({
      type: EDIT_EXCLUIDO_REQUEST
    })
    //se comunica con el servidor
    var variable = caso.get("caso")
    variable = JSON.parse(variable)
    fetch(`${API_URL}/excluido/edit/${variable._id.valueOf()}`, {
      method: 'PUT',
      body: caso,
    })
      .then(response => response.json())
      .then(data => {
        if(data.error){
          //posibles errores
          if(data.type===0){
            message.error(Mensajes.sinToken)
          }
          else if (data.type===1){
            message.error(Mensajes.tokenExpiro)
          }
          else{
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({type: EDIT_EXCLUIDO_FAILURE})//error
        }
        else{
          dispatch({
            type: EDIT_EXCLUIDO_SUCCESS,//exito
            caso: { ...data.caso, key: data.caso._id }
          })
          message.success("El perfil ha sido modificado con éxito")
      }
      })
      .catch(error => {
        dispatch({
          type: EDIT_EXCLUIDO_FAILURE,//error servidor
          error: error
        })
        message.error(Mensajes.errorConexion)
      })
  }
}

//cambiar el perfil de lista de excluidos a espera
export function reactivateCaso(caso, nota, usuario) {
  return function (dispatch) {
  dispatch({
    type: REACTIVATE_EXCLUIDO_REQUEST
  })
  //se comunica con el servidor
  fetch(`${API_URL}/excluido/reactivate/${caso._id.valueOf()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({caso:caso, nota:nota, usuario:usuario}),
  })
    .then(response => response.json())
    .then(data => {
      //posibles errores
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
        dispatch({type: REACTIVATE_EXCLUIDO_FAILURE})
      }
      else{
        dispatch({
          type: REACTIVATE_EXCLUIDO_SUCCESS,//exito
          id: caso._id
        })
        message.success("El caso ha sido reactivado con éxito")
      }
    })
    .catch(error => {
      dispatch({
        type: REACTIVATE_EXCLUIDO_FAILURE,//error servidor
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}
}

//eliminar perfil de excluido
export function deleteCaso(caso, nota, usuario) {
  return function (dispatch) {
  dispatch({
    type: DELETE_EXCLUIDO_REQUEST
  })
  //se comunica con servidor
  fetch(`${API_URL}/excluido/delete/${caso._id.valueOf()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({caso:caso, nota:nota, usuario:usuario}),
  })
    .then(response => response.json())
    .then(data => {
      //posibles errores
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
        dispatch({type: DELETE_EXCLUIDO_FAILURE})
      }
      else{
        dispatch({
          type: DELETE_EXCLUIDO_SUCCESS,//exito
          id: caso._id
        })
        message.success("El caso ha sido eliminado con éxito")
      }
    })
    .catch(error => {
      dispatch({
        type: DELETE_EXCLUIDO_FAILURE,//error servidor
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}
}

//funcion que elimina archivos asociados a un perfil
export function deleteFiles(files) {
  return function (dispatch) {
    dispatch({
      type: DELETE_FILES_REQUEST
    })
    //se comunica con servidor
    fetch(`${API_URL}/eliminar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({files:files}),
    })
      .then(response => response.json())
      .then(data => {
        //posibles errores
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
          dispatch({
            type: DELETE_FILES_SUCCESS   //exito
          })
        }
      })
      .catch(error => {
        dispatch({
          type: DELETE_FILES_FAILURE,//error servidor
          error: error
        })
        message.error(Mensajes.errorConexion)
      })
  }
}