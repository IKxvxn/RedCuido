import {saveState,loadState,removeState} from './localStorage'

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
        saveState(action.usuario)
        return {
            usuario: action.usuario,
            loading: false    
        }
    case 'USER_LOAD_STATE':
        if(loadState().token===undefined){return state}
        return {usuario:loadState(),
                loading: false}
    case 'LOGOUT':
        removeState()
        return{
            usuario:{},
            loading:false
        }
        default:
            return state
            
    }

}

export default loginReducer