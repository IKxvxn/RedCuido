

const DEFAULT_STATE = {
    notificaciones: [],
    filtro:[],
    query:""
}

const homeReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'GET_NOTIFICACIONES_SUCCESS':
            return {notificaciones: action.notificaciones, filtro:state.filtro, query:state.query}
        case 'CLEAN_NOTIFICACIONES_SUCCESS':
            return {...state,notificaciones: []}
        case 'DELETE_NOTIFICACION_SUCCESS':
            return{
                ...state,
                notificaciones:state.notificaciones.filter(item => {return item._id !== action.notificacion})
            }
        case 'GET_FILTERED_SUCCESS':
            return{
                ...state,
                notificaciones:state.notificaciones, filtro:action.filtro, query:action.query
            }
        case 'GET_FILTERED_FAILURE':
            return{
                ...state,
                notificaciones:state.notificaciones, filtro:[], query:action.query
        }
        case 'LOGOUT':
            return{
                ...state,
                notificaciones: []
        }
        default:
            return state
            
    }

}


export default homeReducer