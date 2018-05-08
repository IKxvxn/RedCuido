import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

const GET_NOTIFICACIONES_REQUEST = 'GET_NOTIFICACIONES_REQUEST'
const GET_NOTIFICACIONES_SUCCESS = 'GET_NOTIFICACIONES_SUCCESS'
const GET_NOTIFICACIONES_FAILURE = 'GET_NOTIFICACIONES_FAILURE'

const CLEAN_NOTIFICACIONES_REQUEST = 'CLEAN_NOTIFICACIONES_REQUEST'
const CLEAN_NOTIFICACIONES_SUCCESS = 'CLEAN_NOTIFICACIONES_SUCCESS'
const CLEAN_NOTIFICACIONES_FAILURE = 'CLEAN_NOTIFICACIONES_FAILURE'

const DELETE_NOTIFICACION_REQUEST = 'DELETE_NOTIFICACION_REQUEST'
const DELETE_NOTIFICACION_SUCCESS = 'DELETE_NOTIFICACION_SUCCESS'
const DELETE_NOTIFICACION_FAILURE = 'DELETE_NOTIFICACION_FAILURE'

export function getNotificaciones(usuario) {
  return function (dispatch) {
    dispatch({
      type: GET_NOTIFICACIONES_REQUEST
    })
    fetch(API_URL + "/notificaciones?token="+usuario.token+"&usuario="+usuario.usuario)
      .then(response => response.json())
      .then(data => {
        return data.notificaciones;
      }).then(notificaciones => {
        dispatch({
          type: GET_NOTIFICACIONES_SUCCESS,
          notificaciones: notificaciones
        })
      })
      .catch(error => {
        dispatch({
          type: GET_NOTIFICACIONES_FAILURE,
          error: error
        })
      })
  }
  
}

export function cleanNotificaciones(usuario) {
  return function (dispatch) {
  dispatch({
    type: CLEAN_NOTIFICACIONES_REQUEST
  })
  fetch(`${API_URL}/cleanNotificaciones?token=${usuario.token}&usuario=${usuario.usuario}`, {
    method: 'POST'
  })
    .then(response => response.json())
    .then(data => {
      if(data.error){
        if(data.type===0){
          message.error(Mensajes.sinToken)
        }
        else if (data.type===1){
          message.error(Mensajes.tokenExpiro)
        }
        else{
          message.error(Mensajes.errorDesconocido)
        }
        dispatch({type: CLEAN_NOTIFICACIONES_FAILURE})
      }
      else{
        dispatch({
          type: CLEAN_NOTIFICACIONES_SUCCESS,
        })
      }
    })
    .catch(error => {
      dispatch({
        type: CLEAN_NOTIFICACIONES_FAILURE,
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}}

export function deleteNotificacion(usuario,notificacion) {
  return function (dispatch) {
  dispatch({
    type: DELETE_NOTIFICACION_REQUEST
  })
  fetch(`${API_URL}/deleteNotificacion?token=${usuario.token}&usuario=${usuario.usuario}&notificacion=${notificacion}`, {
    method: 'POST'
  })
    .then(response => response.json())
    .then(data => {
      if(data.error){
        if(data.type===0){
          message.error(Mensajes.sinToken)
        }
        else if (data.type===1){
          message.error(Mensajes.tokenExpiro)
        }
        else{
          message.error(Mensajes.errorDesconocido)
        }
        dispatch({type: DELETE_NOTIFICACION_FAILURE})
      }
      else{
        dispatch({
          type: DELETE_NOTIFICACION_SUCCESS,
          notificacion: notificacion
        })
      }
    })
    .catch(error => {
      dispatch({
        type: DELETE_NOTIFICACION_FAILURE,
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}}