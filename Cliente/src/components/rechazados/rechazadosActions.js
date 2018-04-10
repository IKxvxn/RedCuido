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
const REACTIVATE_RECHAZADO_REQUEST = 'REACTIVATE_RECHAZADO_REQUEST'
const REACTIVATE_RECHAZADO_SUCCESS = 'REACTIVATE_RECHAZADO_SUCCESS'
const REACTIVATE_RECHAZADO_FAILURE = 'REACTIVATE_RECHAZADO_FAILURE'


export function createCaso(caso,reset) {
  return function (dispatch) {
    dispatch({
      type: NEW_RECHAZADO_REQUEST
    })
    fetch(API_URL+"/casoRechazado", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caso),
    })
      .then(response =>response.json())
      .then(caso => {
        message.success("El perfil ha sido agregado con éxito")       
        reset()
        dispatch({
          type: NEW_RECHAZADO_SUCCESS,
          caso: {...caso.caso, key:caso.caso._id}
        })
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

export function getCasos(){
  return function (dispatch) {
  dispatch({
    type: GET_RECHAZADO_REQUEST
  })
  fetch(API_URL+"/casoRechazado")
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


export function editCaso(caso, reset) {
  return function (dispatch) {
  dispatch({
    type: EDIT_RECHAZADO_REQUEST
  })
  fetch(`${API_URL}/rechazado/edit/${caso._id.valueOf()}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(caso),
  })
    .then(response => response.json())
    .then(data => {
      reset()
      dispatch({
        type: EDIT_RECHAZADO_SUCCESS,
        caso: data.caso
      })
      message.success("El perfil ha sido modificado con éxito")
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


export function reactivateCaso(caso, nota) {
  return function (dispatch) {
  dispatch({
    type: REACTIVATE_RECHAZADO_REQUEST
  })
  fetch(`${API_URL}/rechazado/reactivate/${caso._id.valueOf()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({caso:caso, nota:nota}),
  })
    .then(response => response.json())
    .then(data => {
      dispatch({
        type: REACTIVATE_RECHAZADO_SUCCESS,
        id: caso._id
      })
      message.success("El caso ha sido reactivado con éxito")
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