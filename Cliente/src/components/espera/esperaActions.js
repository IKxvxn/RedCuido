import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

const NEW_CASO_REQUEST = 'NEW_CASO_REQUEST'
const NEW_CASO_SUCCESS = 'NEW_CASO_SUCCESS'
const NEW_CASO_FAILURE = 'NEW_CASO_FAILURE'
const GET_CASOS_REQUEST = 'GET_CASOS_REQUEST'
const GET_CASOS_SUCCESS = 'GET_CASOS_SUCCESS'
const GET_CASOS_FAILURE = 'GET_CASOS_FAILURE'


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

export function acceptCaso(){
}