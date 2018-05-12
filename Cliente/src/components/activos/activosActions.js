import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

const NEW_ACTIVO_REQUEST = 'NEW_ACTIVO_REQUEST'
const NEW_ACTIVO_SUCCESS = 'NEW_ACTIVO_SUCCESS'
const NEW_ACTIVO_FAILURE = 'NEW_ACTIVO_FAILURE'
const GET_ACTIVOS_REQUEST = 'GET_ACTIVOS_REQUEST'
const GET_ACTIVOS_SUCCESS = 'GET_ACTIVOS_SUCCESS'
const GET_ACTIVOS_FAILURE = 'GET_ACTIVOS_FAILURE'
const EDIT_ACTIVO_REQUEST = 'EDIT_ACTIVO_REQUEST'
const EDIT_ACTIVO_SUCCESS = 'EDIT_ACTIVO_SUCCESS'
const EDIT_ACTIVO_FAILURE = 'EDIT_ACTIVO_FAILURE'
const EXCLUDE_CASO_REQUEST = 'EXCLUDE_CASO_REQUEST'
const EXCLUDE_CASO_SUCCESS = 'EXCLUDE_CASO_SUCCESS'
const EXCLUDE_CASO_FAILURE = 'EXCLUDE_CASO_FAILURE'
const DELETE_ACTIVO_REQUEST = 'DELETE_ACTIVO_REQUEST'
const DELETE_ACTIVO_SUCCESS = 'DELETE_ACTIVO_SUCCESS'
const DELETE_ACTIVO_FAILURE = 'DELETE_ACTIVO_FAILURE'
const DOWNLOAD_FILE_REQUEST = 'DOWNLOAD_FILE_REQUEST'
const DOWNLOAD_FILE_SUCCESS = 'DOWNLOAD_FILE_SUCCESS'
const DOWNLOAD_FILE_FAILURE = 'DOWNLOAD_FILE_FAILURE'
const DELETE_FILES_REQUEST = 'DELETE_FILES_REQUEST'
const DELETE_FILES_SUCCESS = 'DELETE_FILES_SUCCESS'
const DELETE_FILES_FAILURE = 'DELETE_FILES_FAILURE'

export function activarCaso(data, reset) {
  return function (dispatch) {
    dispatch({
      type: NEW_ACTIVO_REQUEST
    })
    fetch(API_URL + "/activos/casoActivo", {
      method: 'POST',
      body: data
    })
      .then(response => response.json())
      .then(caso => {
        if (caso.error) {
          if (caso.type === 0) {
            message.error(Mensajes.sinToken)
          }
          else if (caso.type === 1) {
            message.error(Mensajes.tokenExpiro)
          }
          else {
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({ type: NEW_ACTIVO_FAILURE })
        }
        else {
          dispatch({
            type: NEW_ACTIVO_SUCCESS,
            caso: { ...caso.caso, key: caso.caso._id }
          })
          message.success("El caso ha sido postulado con éxito")
          reset()
        }
      })
      .catch(error => {
        message.error(Mensajes.errorConexion)
        dispatch({
          type: NEW_ACTIVO_FAILURE,
          error: error
        })
      })
  }
}


export function getCasos(usuario){
  return function (dispatch) {
  dispatch({
    type: GET_ACTIVOS_REQUEST
  })
  fetch(API_URL+"/activos?token="+usuario.token)
    .then(response => response.json())
    .then(data => {
      for(let i = 0; i < data.casos.length; i++){
          data.casos[i].key=data.casos[i]._id
      }
      return data.casos;
    }).then(casos =>{
      dispatch({
        type: GET_ACTIVOS_SUCCESS,
        casosActivos: casos
      })
    })
    .catch(error => {
      dispatch({
        type: GET_ACTIVOS_FAILURE,
        error: error
      })
    })
}
}

export function editCaso(caso, reset) {
  return function (dispatch) {
  dispatch({
    type: EDIT_ACTIVO_REQUEST
  })
  var variable = caso.get("caso")
  variable = JSON.parse(variable)
  fetch(`${API_URL}/activos/edit/${variable._id.valueOf()}`, {
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
        dispatch({type: NEW_ACTIVO_FAILURE})
      }
      else{
        reset(false)
        dispatch({
          type: EDIT_ACTIVO_SUCCESS,
          caso: { ...data.caso, key: data.caso._id }
        })
        message.success(Mensajes.editadoExito)
      }
    })
    .catch(error => {
      dispatch({
        type: EDIT_ACTIVO_FAILURE,
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}
}

export function excludeCaso(caso, nota, usuario) {
  return function (dispatch) {
  dispatch({
    type: EXCLUDE_CASO_REQUEST
  })
  fetch(`${API_URL}/activos/exclude/${caso._id.valueOf()}`, {
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
        dispatch({type: EXCLUDE_CASO_FAILURE})
      }
      else{
        dispatch({
          type: EXCLUDE_CASO_SUCCESS,
          id: caso._id
        })
        message.success("El caso ha sido excluído con éxito.")
      }
    })
    .catch(error => {
      dispatch({
        type: EXCLUDE_CASO_FAILURE,
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}
}


export function deleteCaso(caso, nota, usuario) {
  return function (dispatch) {
  dispatch({
    type: DELETE_ACTIVO_REQUEST
  })
  fetch(`${API_URL}/activos/delete/${caso._id.valueOf()}`, {
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
        dispatch({type: DELETE_ACTIVO_FAILURE})
      }
      else{
        dispatch({
          type: DELETE_ACTIVO_SUCCESS,
          id: caso._id
        })
        message.success("El caso ha sido eliminado con éxito")
      }
    })
    .catch(error => {
      dispatch({
        type: DELETE_ACTIVO_FAILURE,
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}
}

export function downloadFile(caso) {
  return function (dispatch) {
    dispatch({
      type: DOWNLOAD_FILE_REQUEST
    })
    window.open(API_URL + `/activos/download/${caso._id.valueOf()}`)
    dispatch({
      type: DOWNLOAD_FILE_SUCCESS,
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
