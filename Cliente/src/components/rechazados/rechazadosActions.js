import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

const NEW_RECHAZADO_REQUEST = 'NEW_RECHAZADO_REQUEST'
const NEW_RECHAZADO_SUCCESS = 'NEW_RECHAZADO_SUCCESS'
const NEW_RECHAZADO_FAILURE = 'NEW_RECHAZADO_FAILURE'
const GET_RECHAZADO_REQUEST = 'GET_RECHAZADO_REQUEST'
const GET_RECHAZADO_SUCCESS = 'GET_RECHAZADO_SUCCESS'
const GET_RECHAZADO_FAILURE = 'GET_RECHAZADO_FAILURE'
const EDIT_RECHAZADO_REQUEST = 'EDIT_RECHAZADO_REQUEST'
const EDIT_RECHAZADO_SUCCESS = 'EDIT_RECHAZADO_SUCCESS'
const EDIT_RECHAZADO_FAILURE = 'EDIT_RECHAZADO_FAILURE'
const DELETE_RECHAZADO_REQUEST = 'DELETE_RECHAZADO_REQUEST'
const DELETE_RECHAZADO_SUCCESS = 'DELETE_RECHAZADO_SUCCESS'
const DELETE_RECHAZADO_FAILURE = 'DELETE_RECHAZADO_FAILURE'
const REACTIVATE_RECHAZADO_REQUEST = 'REACTIVATE_RECHAZADO_REQUEST'
const REACTIVATE_RECHAZADO_SUCCESS = 'REACTIVATE_RECHAZADO_SUCCESS'
const REACTIVATE_RECHAZADO_FAILURE = 'REACTIVATE_RECHAZADO_FAILURE'
const DOWNLOAD_FILE_REQUEST = 'DOWNLOAD_FILE_REQUEST'
const DOWNLOAD_FILE_SUCCESS = 'DOWNLOAD_FILE_SUCCESS'
//const DOWNLOAD_FILE_FAILURE = 'DOWNLOAD_FILE_FAILURE'
const DELETE_FILES_REQUEST = 'DELETE_FILES_REQUEST'
const DELETE_FILES_SUCCESS = 'DELETE_FILES_SUCCESS'
const DELETE_FILES_FAILURE = 'DELETE_FILES_FAILURE'

export function createCaso(caso,reset) {
  console.log("USUARIOOOO: ")
  console.log(caso)
  return function (dispatch) {
    dispatch({
      type: NEW_RECHAZADO_REQUEST
    })
    fetch(API_URL+"/casoRechazado", {
      method: 'POST',
      body: caso,
    })
      .then(response =>response.json())
      .then(caso => {
        if(caso.error){
          if(caso.type===0){
            message.error(Mensajes.sinToken)
          }
          else if (caso.type===1){
            message.error(Mensajes.tokenExpiro)
          }
          else{
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({type: NEW_RECHAZADO_FAILURE})
        }
        else{
          message.success("El perfil ha sido agregado con éxito")       
          reset()
          dispatch({
            type: NEW_RECHAZADO_SUCCESS,
            caso: {...caso.caso, key:caso.caso._id}
          })
        }
      })
      .catch(error => {
        message.error("Ocurrió un error al tratar de conectarse con el servicio de base de datos")
        dispatch({
          type: NEW_RECHAZADO_FAILURE,
          error: error
        })
      })
  }
}


export function getCasos(usuario){
  return function (dispatch) {
  dispatch({
    type: GET_RECHAZADO_REQUEST
  })
  fetch(API_URL+"/casoRechazado?token="+usuario.token)
    .then(response => response.json())
    .then(data => {
      for(let i = 0; i < data.casos.length; i++){
          data.casos[i].key=data.casos[i]._id
      }
      return data.casos;
    }).then(casos =>{
      dispatch({
        type: GET_RECHAZADO_SUCCESS,
        casosRechazados: casos
      })
    })
    .catch(error => {
      dispatch({
        type: GET_RECHAZADO_FAILURE,
        error: error
      })
    })
}
}


export function editCaso(caso) {
  return function (dispatch) {
  dispatch({
    type: EDIT_RECHAZADO_REQUEST
  })
  var variable = caso.get("caso")
  variable = JSON.parse(variable)
  fetch(`${API_URL}/rechazado/edit/${variable._id.valueOf()}`, {
    method: 'PUT',
    body: caso,
  })
    .then(response => response.json())
    .then(data => {
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
        dispatch({type: EDIT_RECHAZADO_FAILURE})
      }
      else{
        dispatch({
          type: EDIT_RECHAZADO_SUCCESS,
          caso: { ...data.caso, key: data.caso._id }
        })
        message.success("El perfil ha sido modificado con éxito")
      }
    })
    .catch(error => {
      dispatch({
        type: EDIT_RECHAZADO_FAILURE,
        error: error
      })
      message.error("Ocurrió un error al tratar de conectarse con el servicio de base de datos")
    })
}
}

export function downloadFile(caso) {
  return function (dispatch) {
    dispatch({
      type: DOWNLOAD_FILE_REQUEST
    })
    window.open(API_URL + `/rechazado/download/${caso._id.valueOf()}`)
    dispatch({
      type: DOWNLOAD_FILE_SUCCESS,
    })
  }
}

export function reactivateCaso(caso, nota,usuario) {
  return function (dispatch) {
  dispatch({
    type: REACTIVATE_RECHAZADO_REQUEST
  })
  fetch(`${API_URL}/rechazado/reactivate/${caso._id.valueOf()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({caso:caso, nota:nota, usuario:usuario}),
  })
    .then(response => response.json())
    .then(data => {
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
        dispatch({type: REACTIVATE_RECHAZADO_FAILURE})
      }
      else{
        dispatch({
          type: REACTIVATE_RECHAZADO_SUCCESS,
          id: caso._id
        })
        message.success("El caso ha sido reactivado con éxito")}
    })
    .catch(error => {
      dispatch({
        type: REACTIVATE_RECHAZADO_FAILURE,
        error: error
      })
      message.error("Ocurrió un error al tratar de conectarse con el servicio de base de datos")
    })
}
}


export function deleteCaso(caso, nota, usuario) {
  return function (dispatch) {
  dispatch({
    type: DELETE_RECHAZADO_REQUEST
  })
  fetch(`${API_URL}/rechazado/delete/${caso._id.valueOf()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({caso:caso, nota:nota, usuario:usuario}),
  })
    .then(response => response.json())
    .then(data => {
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
        dispatch({type: DELETE_RECHAZADO_FAILURE})
      }
      else{
        dispatch({
          type: DELETE_RECHAZADO_SUCCESS,
          id: caso._id
        })
        message.success("El caso ha sido eliminado con éxito")
      }
    })
    .catch(error => {
      dispatch({
        type: DELETE_RECHAZADO_FAILURE,
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}
}
export function deleteFiles(files) {
  return function (dispatch) {
    dispatch({
      type: DELETE_FILES_REQUEST
    })
    fetch(`${API_URL}/eliminar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({files:files}),
    })
      .then(response => response.json())
      .then(data => {
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
            type: DELETE_FILES_SUCCESS
          })
        }
      })
      .catch(error => {
        dispatch({
          type: DELETE_FILES_FAILURE,
          error: error
        })
        message.error(Mensajes.errorConexion)
      })
  }
}