import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

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
const DELETE_FILES_REQUEST = 'DELETE_FILES_REQUEST'
const DELETE_FILES_SUCCESS = 'DELETE_FILES_SUCCESS'
const DELETE_FILES_FAILURE = 'DELETE_FILES_FAILURE'


export function createCaso(caso, reset) {
  return function (dispatch) {
    dispatch({
      type: NEW_EXCLUIDO_REQUEST
    })
    fetch(API_URL + "/casoExcluido", {
      method: 'POST',
      body: caso,
    })
      .then(response => response.json())
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
          dispatch({type: NEW_EXCLUIDO_FAILURE})
        }
        else{
        message.success("El perfil ha sido agregado con éxito")
          reset()
          dispatch({
            type: NEW_EXCLUIDO_SUCCESS,
            caso: { ...caso.caso, key: caso.caso._id }
          })
        }
      })
      .catch(error => {
        message.error(Mensajes.errorConexion)
        dispatch({
          type: NEW_EXCLUIDO_FAILURE,
          error: error
        })
      })
  }
}

export function getCasos(usuario) {
  return function (dispatch) {
    dispatch({
      type: GET_EXCLUIDOS_REQUEST
    })
    fetch(API_URL + "/casoExcluido?token="+usuario.token)
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.casos.length; i++) {
          data.casos[i].key = data.casos[i]._id
        }
        return data.casos;
      }).then(casos => {
        dispatch({
          type: GET_EXCLUIDOS_SUCCESS,
          casosExcluidos: casos
        })
      })
      .catch(error => {
        dispatch({
          type: GET_EXCLUIDOS_FAILURE,
          error: error
        })
      })
  }
}


export function editCaso(caso, reset) {
  return function (dispatch) {
    dispatch({
      type: EDIT_EXCLUIDO_REQUEST
    })
    var variable = caso.get("caso")
    variable = JSON.parse(variable)
    fetch(`${API_URL}/excluido/edit/${variable._id.valueOf()}`, {
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
          dispatch({type: EDIT_EXCLUIDO_FAILURE})
        }
        else{
          reset(false)
          dispatch({
            type: EDIT_EXCLUIDO_SUCCESS,
            caso: data.caso
          })
          message.success("El perfil ha sido modificado con éxito")
      }
      })
      .catch(error => {
        dispatch({
          type: EDIT_EXCLUIDO_FAILURE,
          error: error
        })
        message.error(Mensajes.errorConexion)
      })
  }
}

export function reactivateCaso(caso, nota, usuario) {
  return function (dispatch) {
  dispatch({
    type: REACTIVATE_EXCLUIDO_REQUEST
  })
  fetch(`${API_URL}/excluido/reactivate/${caso._id.valueOf()}`, {
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
        dispatch({type: REACTIVATE_EXCLUIDO_FAILURE})
      }
      else{
        dispatch({
          type: REACTIVATE_EXCLUIDO_SUCCESS,
          id: caso._id
        })
        message.success("El caso ha sido reactivado con éxito")
      }
    })
    .catch(error => {
      dispatch({
        type: REACTIVATE_EXCLUIDO_FAILURE,
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}
}


export function deleteCaso(caso, nota, usuario) {
  return function (dispatch) {
  dispatch({
    type: DELETE_EXCLUIDO_REQUEST
  })
  fetch(`${API_URL}/excluido/delete/${caso._id.valueOf()}`, {
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
        dispatch({type: DELETE_EXCLUIDO_FAILURE})
      }
      else{
        dispatch({
          type: DELETE_EXCLUIDO_SUCCESS,
          id: caso._id
        })
        message.success("El caso ha sido eliminado con éxito")
      }
    })
    .catch(error => {
      dispatch({
        type: DELETE_EXCLUIDO_FAILURE,
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