import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

const NEW_ACTIVO_REQUEST = 'NEW_ACTIVO_REQUEST'
const NEW_ACTIVO_SUCCESS = 'NEW_ACTIVO_SUCCESS'
const NEW_ACTIVO_FAILURE = 'NEW_ACTIVO_FAILURE'

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
        message.success("El caso ha sido activado con éxito")       
        reset()
        dispatch({
          type: NEW_ACTIVO_SUCCESS,
          caso: {...caso.caso, key:caso.caso._id}
        })
      })
      .catch(error => {
        message.error("Ocurrió un error al tratar de conectarse con el servicio de base de datos")
        dispatch({
          type: NEW_ACTIVO_FAILURE,
          error: error
        })
      })
  }
}