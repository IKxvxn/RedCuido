import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/auth'

const NEW_USUARIO_REQUEST = 'NEW_USUARIO_REQUEST'
const NEW_USUARIO_SUCCESS = 'NEW_USUARIO_SUCCESS'
const NEW_USUARIO_FAILURE = 'NEW_USUARIO_FAILURE'

export function createUsuario(usuario) {
  return function (dispatch) {
    dispatch({
      type: NEW_USUARIO_REQUEST
    })
    fetch(API_URL + "/crearUsuario", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    })
      .then(response => response.json())
      .then(usuario => {
        message.success("El usuario ha sido creado con éxito")
        dispatch({
          type: NEW_USUARIO_SUCCESS,
          usuario: usuario.usuario
        })
      })
      .catch(error => {
        message.error(Mensajes.errorConexion)
        dispatch({
          type: NEW_USUARIO_FAILURE,
          error: error
        })
      })
  }
}

export function ingresar(usuario) {
  return function (dispatch) {
    dispatch({
      type: NEW_USUARIO_REQUEST
    })
    fetch(API_URL + "/ingresar", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    })
      .then(response => response.json())
      .then(usuario => {
        message.success("El usuario ha sido creado con éxito")
        dispatch({
          type: NEW_USUARIO_SUCCESS,
          usuario: usuario.usuario
        })
      })
      .catch(error => {
        message.error(Mensajes.errorConexion)
        dispatch({
          type: NEW_USUARIO_FAILURE,
          error: error
        })
      })
  }
}