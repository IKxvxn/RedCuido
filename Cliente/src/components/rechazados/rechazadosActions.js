import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

const NEW_RECHAZADO_REQUEST = 'NEW_RECHAZADO_REQUEST'
const NEW_RECHAZADO_SUCCESS = 'NEW_RECHAZADO_SUCCESS'
const NEW_RECHAZADO_FAILURE = 'NEW_RECHAZADO_FAILURE'
const GET_RECHAZADO_REQUEST = 'GET_RECHAZADO_REQUEST'
const GET_RECHAZADO_SUCCESS = 'GET_RECHAZADO_SUCCESS'
const GET_RECHAZADO_FAILURE = 'GET_RECHAZADO_FAILURE'


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

export function acceptCaso(){
}