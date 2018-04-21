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

export function activarCaso(caso,reset) {
  return function (dispatch) {
    dispatch({
      type: NEW_ACTIVO_REQUEST
    })
    fetch(API_URL+"/casoActivo", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caso),
    })
      .then(response =>response.json())
      .then(caso => {
        message.success("El caso ha sido activado con éxito.")       
        reset()
        dispatch({
          type: NEW_ACTIVO_SUCCESS,
          caso: {...caso.caso, key:caso.caso._id}
        })
      })
      .catch(error => {
        message.error("Ocurrió un error al tratar de conectarse con el servicio de base de datos.")
        dispatch({
          type: NEW_ACTIVO_FAILURE,
          error: error
        })
      })
  }
}

export function getCasos(){
  return function (dispatch) {
  dispatch({
    type: GET_ACTIVOS_REQUEST
  })
  fetch(API_URL+"/activos")
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
  console.log(caso)
  fetch(`${API_URL}/activos/edit/${caso._id.valueOf()}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(caso),
  })
    .then(response => response.json())
    .then(data => {
      reset()
      dispatch({
        type: EDIT_ACTIVO_SUCCESS,
        caso: data.caso
      })
      message.success("El caso ha sido modificado con éxito")
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

export function excludeCaso(caso, nota) {
  return function (dispatch) {
  dispatch({
    type: EXCLUDE_CASO_REQUEST
  })
  fetch(`${API_URL}/activos/exclude/${caso._id.valueOf()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({caso:caso, nota:nota}),
  })
    .then(response => response.json())
    .then(data => {
      dispatch({
        type: EXCLUDE_CASO_SUCCESS,
        id: caso._id
      })
      message.success("El caso ha sido excluído con éxito.")
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