import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

const NEW_EXCLUIDO_REQUEST = 'NEW_EXLCUIDO_REQUEST'
const NEW_EXCLUIDO_SUCCESS = 'NEW_EXCLUIDO_SUCCESS'
const NEW_EXCLUIDO_FAILURE = 'NEW_EXCLUIDO_FAILURE'
const GET_EXCLUIDOS_REQUEST = 'GET_EXCLUIDOS_REQUEST'
const GET_EXCLUIDOS_SUCCESS = 'GET_EXCLUIDOS_SUCCESS'
const GET_EXCLUIDOS_FAILURE = 'GET_EXCLUIDOS_FAILURE'


export function createCaso(caso,reset) {
  return function (dispatch) {
    dispatch({
      type: NEW_EXCLUIDO_REQUEST
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
          type: NEW_EXCLUIDO_SUCCESS,
          caso: {...caso.caso, key:caso.caso._id}
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

export function getCasos(){
  return function (dispatch) {
  dispatch({
    type: GET_EXCLUIDOS_REQUEST
  })
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      for(let i = 0; i < data.casos.length; i++){
          data.casos[i].key=data.casos[i]._id
      }
      return data.casos;
    }).then(casos =>{
      dispatch({
        type: GET_EXCLUIDOS_SUCCESS,
        casosEspera: casos
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

export function acceptCaso(){
}