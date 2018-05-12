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
const DOWNLOAD_FILE_REQUEST = 'DOWNLOAD_FILE_REQUEST'
const DOWNLOAD_FILE_SUCCESS = 'DOWNLOAD_FILE_SUCCESS'
//const DOWNLOAD_FILE_FAILURE = 'DOWNLOAD_FILE_FAILURE'
const DELETE_ESPERA_REQUEST = 'DELETE_ESPERA_REQUEST'
const DELETE_ESPERA_SUCCESS = 'DELETE_ESPERA_SUCCESS'
const DELETE_ESPERA_FAILURE = 'DELETE_ESPERA_FAILURE'
const DELETE_FILES_REQUEST = 'DELETE_FILES_REQUEST'
const DELETE_FILES_SUCCESS = 'DELETE_FILES_SUCCESS'
const DELETE_FILES_FAILURE = 'DELETE_FILES_FAILURE'

export function createCaso(data, reset) {
  return function (dispatch) {
    dispatch({
      type: NEW_CASO_REQUEST
    })
    fetch(API_URL + "/espera/casoEspera", {
      method: 'POST',
      body: data
    })
      .then(response => response.json())
      .then(caso => {
        if (caso.error) {
          if (caso.type === 0) {
            message.error(Mensajes.sinToken)
          }
          else if (caso.type === 1) {
            message.error(Mensajes.tokenExpiro)
          }
          else {
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({ type: NEW_CASO_FAILURE })
        }
        else {
          dispatch({
            type: NEW_CASO_SUCCESS,
            caso: { ...caso.caso, key: caso.caso._id }
          })
          message.success("El caso ha sido postulado con éxito")
          reset()
        }
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

export function getCasos(usuario) {

  return function (dispatch) {
    dispatch({
      type: GET_CASOS_REQUEST
    })
    fetch(API_URL + "/espera?token=" + usuario.token)
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.casos.length; i++) {
          data.casos[i].key = data.casos[i]._id
        }
        return data.casos;
      }).then(casos => {
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
    var variable = caso.get("caso")
    variable = JSON.parse(variable)

    fetch(`${API_URL}/espera/edit/${variable._id.valueOf()}`, {
      method: 'PUT',
      body: caso,
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          if (data.type === 0) {
            message.error(Mensajes.sinToken)
          }
          else if (data.type === 1) {
            message.error(Mensajes.tokenExpiro)
          }
          else {
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({ type: EDIT_CASO_FAILURE })
        }
        else {
          dispatch({
            type: EDIT_CASO_SUCCESS,
            caso: { ...data.caso, key: data.caso._id }
          })
          message.success(Mensajes.editadoExito)
          reset(false)
        }
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


export function acceptCaso(caso, nota, usuario) {
  return function (dispatch) {
    dispatch({
      type: ACCEPT_CASO_REQUEST
    })
    fetch(`${API_URL}/espera/accept/${caso._id.valueOf()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caso: caso, nota: nota, usuario: usuario }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          if (data.type === 0) {
            message.error(Mensajes.sinToken)
          }
          else if (data.type === 1) {
            message.error(Mensajes.tokenExpiro)
          }
          else {
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({ type: EDIT_CASO_FAILURE })
        }
        else {
          dispatch({
            type: ACCEPT_CASO_SUCCESS,
            id: caso._id
          })
          message.success("El caso ha sido aceptado con éxito")
        }
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

export function rejectCaso(caso, nota, usuario) {
  return function (dispatch) {
    dispatch({
      type: REJECT_CASO_REQUEST
    })
    fetch(`${API_URL}/espera/reject/${caso._id.valueOf()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caso: caso, nota: nota, usuario: usuario }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          if (data.type === 0) {
            message.error(Mensajes.sinToken)
          }
          else if (data.type === 1) {
            message.error(Mensajes.tokenExpiro)
          }
          else {
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({ type: EDIT_CASO_FAILURE })
        }
        else {
          dispatch({
            type: REJECT_CASO_SUCCESS,
            id: caso._id
          })
          message.success("El caso ha sido rechazado con éxito")
        }
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


export function downloadFile(caso) {
  return function (dispatch) {
    dispatch({
      type: DOWNLOAD_FILE_REQUEST
    })
    window.open(API_URL + `/espera/download/${caso._id.valueOf()}`)
    dispatch({
      type: DOWNLOAD_FILE_SUCCESS,
    })
  }
}

export function deleteCaso(caso, nota, usuario) {
  return function (dispatch) {
  dispatch({
    type: DELETE_ESPERA_REQUEST
  })
  fetch(`${API_URL}/espera/delete/${caso._id.valueOf()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({caso:caso, nota:nota, usuario:usuario}),
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
        dispatch({type: DELETE_ESPERA_FAILURE})
      }
      else{
        dispatch({
          type: DELETE_ESPERA_SUCCESS,
          id: caso._id
        })
        message.success("El caso ha sido eliminado con éxito")
      }
    })
    .catch(error => {
      dispatch({
        type: DELETE_ESPERA_FAILURE,
        error: error
      })
      message.error(Mensajes.errorConexion)
    })
}
}

export function deleteFiles(files) {
  return function (dispatch) {
    dispatch({
      type: DELETE_FILES_REQUEST
    })
    fetch(`${API_URL}/eliminar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({files:files}),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          if (data.type === 0) {
            message.error(Mensajes.sinToken)
          }
          else if (data.type === 1) {
            message.error(Mensajes.tokenExpiro)
          }
          else {
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({ type: DELETE_FILES_FAILURE })
        }
        else {
          dispatch({
            type: DELETE_FILES_SUCCESS
          })
        }
      })
      .catch(error => {
        dispatch({
          type: DELETE_FILES_FAILURE,
          error: error
        })
        message.error(Mensajes.errorConexion)
      })
  }
}
