const API_URL = 'http://localhost:8079/home'

const GET_NOTIFICACIONES_REQUEST = 'GET_NOTIFICACIONES_REQUEST'
const GET_NOTIFICACIONES_SUCCESS = 'GET_NOTIFICACIONES_SUCCESS'
const GET_NOTIFICACIONES_FAILURE = 'GET_NOTIFICACIONES_FAILURE'

export function getNotificaciones(usuario) {
  return function (dispatch) {
    dispatch({
      type: GET_NOTIFICACIONES_REQUEST
    })
    fetch(API_URL + "/notificaciones?token="+usuario.token+"&usuario="+usuario.usuario)
      .then(response => response.json())
      .then(data => {
        console.log(data)
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