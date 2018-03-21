import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

const NEW_CASO_REQUEST = 'NEW_CASO_REQUEST'
const NEW_CASO_SUCCESS = 'NEW_CASO_SUCCESS'
const NEW_CASO_FAILURE = 'NEW_CASO_FAILURE'
const GET_CASOS_REQUEST = 'GET_CASOS_REQUEST'
const GET_CASOS_SUCCESS = 'GET_CASOS_SUCCESS'
const GET_CASOS_FAILURE = 'GET_CASOS_FAILURE'
const EDIT_CASO_REQUEST = 'EDIT_CASO_REQUEST'
const EDIT_CASO_SUCCESS = 'EDIT_CASO_SUCCESS'
const EDIT_CASO_FAILURE = 'EDIT_CASO_FAILURE'
const ACCEPT_CASO_REQUEST = 'ACCEPT_CASO_REQUEST'
const ACCEPT_CASO_SUCCESS = 'ACCEPT_CASO_SUCCESS'
const ACCEPT_CASO_FAILURE = 'ACCEPT_CASO_FAILURE'

export function createCaso(caso,reset) {
  return function (dispatch) {
    dispatch({
      type: NEW_CASO_REQUEST
    })
    fetch(API_URL+"/casoEspera", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caso),
    })
      .then(response =>response.json())
      .then(caso => {
        message.success("El caso ha sido postulado con éxito")       
        reset()
        dispatch({
          type: NEW_CASO_SUCCESS,
          caso: {...caso.caso, key:caso.caso._id}
        })
      })
      .catch(error => {
        message.error("Ocurrió un error al tratar de conectarse con el servicio de base de datos")
        dispatch({
          type: NEW_CASO_FAILURE,
          error: error
        })
      })
  }
}

export function getCasos(){
  return function (dispatch) {
  dispatch({
    type: GET_CASOS_REQUEST
  })
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      dispatch({
        type: GET_CASOS_SUCCESS,
        casosEspera: data.casos
      })
    })
    .catch(error => {
      dispatch({
        type: GET_CASOS_FAILURE,
        error: error
      })
    })
}
}

export function acceptCaso(caso) {
  return function (dispatch) {
  dispatch({
    type: ACCEPT_CASO_REQUEST
  })
  fetch(`${API_URL}/aceptarCaso/${caso._id}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(caso),
  })
    .then(response => response.json())
    .then(data => {
      dispatch({
        type: ACCEPT_CASO_SUCCESS,
      })
    })
    .catch(error => {
      dispatch({
        type: ACCEPT_CASO_FAILURE,
        error: error
      })
    })
}
}

export function editCaso(caso) {
  return function (dispatch) {
  dispatch({
    type: EDIT_CASO_REQUEST
  })
  fetch(`${API_URL}/edit/${caso._id.str}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(caso),
  })
    .then(response => response.json())
    .then(caso => {
      dispatch({
        type: EDIT_CASO_SUCCESS,
        caso: {...caso.caso, key:caso.caso._id}
      })
    })
    .catch(error => {
      dispatch({
        type: EDIT_CASO_FAILURE,
        error: error
      })
    })
}
}