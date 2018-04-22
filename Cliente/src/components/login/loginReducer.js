
const DEFAULT_STATE = {
    usuario: {},
    loading: false
}

const loginReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'NEW_LOGIN_REQUEST':
        return {
            usuario: state.usuario,
            loading: true    
        }
    case 'NEW_LOGIN_FAILURE':
        return {
            usuario: state.usuario,
            loading: false    
        }
    case 'NEW_LOGIN_SUCCESS':
        return {
            usuario: action.usuario,
            loading: false    
        }
        default:
            return state
            
    }

}

export default loginReducer