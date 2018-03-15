import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

const NEW_CASO_REQUEST = 'NEW_CASO_REQUEST'
const NEW_CASO_SUCCESS = 'NEW_CASO_SUCCESS'
const NEW_CASO_FAILURE = 'NEW_CASO_FAILURE'

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