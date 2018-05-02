
const DEFAULT_STATE = {
    notificaciones: []
}

const exampleReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'GET_NOTIFICACIONES_SUCCESS':
            return {notificaciones: action.notificaciones}
        default:
            return state
            
    }

}

export default exampleReducer