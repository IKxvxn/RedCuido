import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

const NEW_CASO_REQUEST = 'NEW_CASO_REQUEST'
const NEW_CASO_SUCCESS = 'NEW_CASO_SUCCESS'
const NEW_CASO_FAILURE = 'NEW_CASO_FAILURE'
const GET_CASOS_REQUEST = 'GET_CASOS_REQUEST'
const GET_CASOS_SUCCESS = 'GET_CASOS_SUCCESS'
const GET_CASOS_FAILURE = 'GET_CASO_FAILURE'
const EDIT_CASO_REQUEST = 'EDIT_CASO_REQUEST'
const EDIT_CASO_SUCCESS = 'EDIT_CASO_SUCCESS'
const EDIT_CASO_FAILURE = 'EDIT_CASO_FAILURE'
const ACCEPT_CASO_REQUEST = 'ACCEPT_CASO_REQUEST'
const ACCEPT_CASO_SUCCESS = 'ACCEPT_CASO_SUCCESS'
const ACCEPT_CASO_FAILURE = 'ACCEPT_CASO_FAILURE'
const REJECT_CASO_REQUEST = 'REJECT_CASO_REQUEST'
const REJECT_CASO_SUCCESS = 'REJECT_CASO_SUCCESS'
const REJECT_CASO_FAILURE = 'REJECT_CASO_FAILURE'
const UPLOAD_FILE_REQUEST = 'UPLOAD_FILE_REQUEST'
const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS'
const UPLOAD_FILE_FAILURE = 'UPLOAD_FILE_FAILURE'

export function createCaso(data,reset) {
  return function (dispatch) {
    dispatch({
      type: NEW_CASO_REQUEST
    })
    fetch(API_URL+"/espera/casoEspera", {
      method: 'POST',
      body: data
    })
      .then(response =>response.json())
      .then(caso => {    
        dispatch({
          type: NEW_CASO_SUCCESS,
          caso: {...caso.caso, key:caso.caso._id}
        })
        message.success("El caso ha sido postulado con éxito")
        reset()
      })
      .catch(error => {
        message.error(Mensajes.errorConexion)
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
  fetch(API_URL+"/espera")
    .then(response => response.json())
    .then(data => {
      for(let i = 0; i < data.casos.length; i++){
          data.casos[i].key=data.casos[i]._id
      }
      return data.casos;
    }).then(casos =>{
      dispatch({
        type: GET_CASOS_SUCCESS,
        casosEspera: casos
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

export function editCaso(caso, reset) {
  return function (dispatch) {
  dispatch({
    type: EDIT_CASO_REQUEST
  })
  console.log(caso.get("caso"))
  var variable = caso.get("caso")
  variable = JSON.parse(variable)
  console.log(variable._id)
  fetch(`${API_URL}/espera/edit/${variable._id.valueOf()}`, {
    method: 'PUT',
    body: caso,
  })
    .then(response => response.json())
    .then(data => {
      reset()
      dispatch({
        type: EDIT_CASO_SUCCESS,
        caso: data.caso
      })
      message.success("El caso ha sido modificado con éxito")
    })
    .catch(error => {
      dispatch({
        type: EDIT_CASO_FAILURE,
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}
}


export function acceptCaso(caso, nota) {
  return function (dispatch) {
  dispatch({
    type: ACCEPT_CASO_REQUEST
  })
  fetch(`${API_URL}/espera/accept/${caso._id.valueOf()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({caso:caso, nota:nota}),
  })
    .then(response => response.json())
    .then(data => {
      dispatch({
        type: ACCEPT_CASO_SUCCESS,
        id: caso._id
      })
      message.success("El caso ha sido aceptado con éxito")
    })
    .catch(error => {
      dispatch({
        type: ACCEPT_CASO_FAILURE,
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}
}

export function rejectCaso(caso, nota) {
  return function (dispatch) {
  dispatch({
    type: REJECT_CASO_REQUEST
  })
  fetch(`${API_URL}/espera/reject/${caso._id.valueOf()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({caso:caso, nota:nota}),
  })
    .then(response => response.json())
    .then(data => {
      dispatch({
        type: REJECT_CASO_SUCCESS,
        id: caso._id
      })
      message.success("El caso ha sido rechazado con éxito")
    })
    .catch(error => {
      dispatch({
        type: REJECT_CASO_FAILURE,
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}
}

export function uploadFile(caso,  reset) {
  return function (dispatch) {
  dispatch({
    type: UPLOAD_FILE_REQUEST
  })
  fetch(`${API_URL}/espera/edit/${caso._id.valueOf()}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(caso),
  })
    .then(response => response.json())
    .then(data => {
      reset()
      dispatch({
        type: UPLOAD_FILE_SUCCESS,
        caso: data.caso
      })
      message.success("El archivo ha sido agregado con éxito")
    })
    .catch(error => {
      dispatch({
        type: UPLOAD_FILE_FAILURE,
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}
}

