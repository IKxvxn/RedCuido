

const DEFAULT_STATE = {
    notificaciones: []
}

const homeReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'GET_NOTIFICACIONES_SUCCESS':
            return {notificaciones: action.notificaciones}
        case 'CLEAN_NOTIFICACIONES_SUCCESS':
            return {notificaciones: []}
        case 'DELETE_NOTIFICACION_SUCCESS':
            return{
                notificaciones:state.notificaciones.filter(item => {return item._id !== action.notificacion})
            }
        case 'LOGOUT':
            return{
                notificaciones: []
        }
        default:
            return state
            
    }

}


export default homeReducer