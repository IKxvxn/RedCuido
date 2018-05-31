import { message } from 'antd';
import * as Mensajes from '../../assets/mensajes'

const API_URL = 'http://localhost:8079/home'

const NEW_USER_REQUEST = 'NEW_USER_REQUEST'
const NEW_USER_SUCCESS = 'NEW_USER_SUCCESS'
const NEW_USER_FAILURE = 'NEW_USER_FAILURE'
const GET_USER_REQUEST = 'GET_USER_REQUEST'
const GET_USER_SUCCESS = 'GET_USER_SUCCESS'
const GET_USER_FAILURE = 'GET_USER_FAILURE'
const EDIT_USER_REQUEST = 'EDIT_USER_REQUEST'
const EDIT_USER_SUCCESS = 'EDIT_USER_SUCCESS'
const EDIT_USER_FAILURE = 'EDIT_USER_FAILURE'
const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST'
const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS'
const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE'

export function createCaso(usuario) {
  //Funcion que crea un usuario
  return function (dispatch) {
    dispatch({
      type: NEW_USER_REQUEST
    })
    //Se envia al servidor el usuario
    fetch(API_URL + "/user/create", {
      method: 'POST',
      body: usuario,
    })
      .then(response => response.json())
      .then(usuario => {
        if (usuario.error) {
          //Usuario ya existe
          message.error("El usuario ya existe, no se ha podido crear")
          dispatch({
            type: NEW_USER_FAILURE,
          })
        }
        else {
          //Creacion de usuario exitosa
          message.success("El usuario ha sido creado con éxito")
          dispatch({
            type: NEW_USER_SUCCESS,
            caso: {...usuario.caso, key:usuario.caso._id}
          })
        }
      })
      .catch(error => {
        //Ocurrio un error
        message.error(Mensajes.errorConexion)
        dispatch({
          type: NEW_USER_FAILURE,
          error: error
        })
      })
  }
}


export function getCasos(usuario) {
  //Obtiene todos los usuarios de la base de datos
  return function (dispatch) {
    dispatch({
      type: GET_USER_REQUEST
    })
    //Manda la peticion al servidor
    fetch(API_URL + "/user?token=" + usuario.token +"&tipo=" +  usuario.tipo)
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.casos.length; i++) {
          //Define el key para cada usuario
          data.casos[i].key = data.casos[i]._id
        }
        return data.casos;
      }).then(casos => {
        dispatch({
          //Obtencion de usuarios exitosa
          type: GET_USER_SUCCESS,
          casosUser: casos
        })
      })
      .catch(error => {
        dispatch({
          //Error en servidor
          type: GET_USER_FAILURE,
          error: error
        })
      })
  }
}


export function editCaso(caso, reset) {
  //Funcion que edita un usuario
  return function (dispatch) {
    dispatch({
      type: EDIT_USER_REQUEST
    })
    //Envia el id del usuario al servidor junto a los datos
    var variable = caso.get("caso")
    variable = JSON.parse(variable)
    fetch(`${API_URL}/user/edit/${variable._id.valueOf()}`, {
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
          dispatch({ type: EDIT_USER_FAILURE })
        }
        else {
          //Modificacion de usuario exitosa
          dispatch({
            type: EDIT_USER_SUCCESS,
            caso: { ...data.caso, key: data.caso._id }
          })
          message.success("El usuario ha sido modificado con éxito")
        }
      })
      .catch(error => {
        //Error en servidor
        dispatch({
          type: EDIT_USER_FAILURE,
          error: error
        })
        message.error("Ocurrió un error al tratar de conectarse con el servicio de base de datos")
      })
  }
}

export function deleteCaso(caso, usuario) {
  //Funcion que elimina usuarios
  return function (dispatch) {
    dispatch({
      type: DELETE_USER_REQUEST
    })
    //Se manda al servidor el id del usuario
    fetch(`${API_URL}/user/delete/${caso._id.valueOf()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caso: caso, usuario: usuario }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          //Tipos de errores posibles
          if (data.type === 0) {
            message.error(Mensajes.sinToken)
          }
          else if (data.type === 1) {
            message.error(Mensajes.tokenExpiro)
          }
          else {
            message.error(Mensajes.errorDesconocido)
          }
          dispatch({ type: DELETE_USER_FAILURE })
        }
        else {
          //Eliminacion exitosa de usuario
          dispatch({
            type: DELETE_USER_SUCCESS,
            id: caso._id
          })
          message.success("El usuario ha sido eliminado con éxito")
        }
      })
      .catch(error => {
        //Error en servidor
        dispatch({
          type: DELETE_USER_FAILURE,
          error: error
        })
        message.error(Mensajes.errorConexion)
      })
  }
}