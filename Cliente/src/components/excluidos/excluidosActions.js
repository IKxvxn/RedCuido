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


export function createCaso(caso, reset) {
  return function (dispatch) {
    dispatch({
      type: NEW_EXCLUIDO_REQUEST
    })
    fetch(API_URL + "/casoExcluido", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caso),
    })
      .then(response => response.json())
      .then(caso => {
        message.success("El perfil ha sido agregado con éxito")
        reset()
        dispatch({
          type: NEW_EXCLUIDO_SUCCESS,
          caso: { ...caso.caso, key: caso.caso._id }
        })
      })
      .catch(error => {
        message.error("Ocurrió un error al tratar de conectarse con el servicio de base de datos")
        dispatch({
          type: NEW_EXCLUIDO_FAILURE,
          error: error
        })
      })
  }
}

export function getCasos() {
  return function (dispatch) {
    dispatch({
      type: GET_EXCLUIDOS_REQUEST
    })
    fetch(API_URL + "/casoExcluido")
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
    fetch(`${API_URL}/excluido/edit/${caso._id.valueOf()}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caso),
    })
      .then(response => response.json())
      .then(data => {
        reset()
        dispatch({
          type: EDIT_EXCLUIDO_SUCCESS,
          caso: data.caso
        })
        message.success("El perfil ha sido modificado con éxito")
      })
      .catch(error => {
        dispatch({
          type: EDIT_EXCLUIDO_FAILURE,
          error: error
        })
        message.error("Ocurrió un error al tratar de conectarse con el servicio de base de datos")
      })
  }
}
