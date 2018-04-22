import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

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

export function createCaso(data, reset) {
  return function (dispatch) {
    dispatch({
      type: NEW_VISITA_REQUEST
    })
    fetch(API_URL + "/visita/casoVisita", {
      method: 'POST',
      body: data
    })
      .then(response => response.json())
      .then(caso => {
        dispatch({
          type: NEW_VISITA_SUCCESS,
          caso: { ...caso.caso, key: caso.caso._id }
        })
        message.success("El perfil ha sido postulado con éxito")
        reset()
      })
      .catch(error => {
        message.error(Mensajes.errorConexion)
        dispatch({
          type: NEW_VISITA_FAILURE,
          error: error
        })
      })
  }
}

export function getCasos() {
  return function (dispatch) {
    dispatch({
      type: GET_VISITA_REQUEST
    })
    fetch(API_URL + "/visita")
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.casos.length; i++) {
          data.casos[i].key = data.casos[i]._id
        }
        return data.casos;
      }).then(casos => {
        dispatch({
          type: GET_VISITA_SUCCESS,
          casosVisita: casos
        })
      })
      .catch(error => {
        dispatch({
          type: GET_VISITA_FAILURE,
          error: error
        })
      })
  }
}

export function editCaso(caso, reset) {
  return function (dispatch) {
    dispatch({
      type: EDIT_VISITA_REQUEST
    })
    var variable = caso.get("caso")
    variable = JSON.parse(variable)
    console.log(variable._id)
    fetch(`${API_URL}/visita/edit/${variable._id.valueOf()}`, {
      method: 'PUT',
      body: caso,
    })
      .then(response => response.json())
      .then(data => {
        reset()
        dispatch({
          type: EDIT_VISITA_SUCCESS,
          caso: data.caso
        })
        message.success("El perfil ha sido modificado con éxito")
      })
      .catch(error => {
        dispatch({
          type: EDIT_VISITA_FAILURE,
          error: error
        })
        message.error(Mensajes.errorConexion)
      })
  }
}


export function acceptCaso(caso, nota) {
  return function (dispatch) {
    dispatch({
      type: ACCEPT_VISITA_REQUEST
    })
    fetch(`${API_URL}/visita/accept/${caso._id.valueOf()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caso: caso, nota: nota }),
    })
      .then(response => response.json())
      .then(data => {
        dispatch({
          type: ACCEPT_VISITA_SUCCESS,
          id: caso._id
        })
        message.success("El perfil ha sido aceptado con éxito")
      })
      .catch(error => {
        dispatch({
          type: ACCEPT_VISITA_FAILURE,
          error: error
        })
        message.error(Mensajes.errorConexion)
      })
  }
}

export function rejectCaso(caso, nota) {
  return function (dispatch) {
    dispatch({
      type: REJECT_VISITA_REQUEST
    })
    fetch(`${API_URL}/visita/reject/${caso._id.valueOf()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caso: caso, nota: nota }),
    })
      .then(response => response.json())
      .then(data => {
        dispatch({
          type: REJECT_VISITA_SUCCESS,
          id: caso._id
        })
        message.success("El perfil ha sido rechazado con éxito")
      })
      .catch(error => {
        dispatch({
          type: REJECT_VISITA_FAILURE,
          error: error
        })
        message.error(Mensajes.errorConexion)
      })
  }
}
