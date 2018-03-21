
const DEFAULT_STATE = {
    casosEspera: [],
    loading: false,
}

const exampleReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'NEW_CASO_REQUEST':
            return {
                casosEspera: state.casosEspera,
                loading: true    
            }
        case 'NEW_CASO_FAILURE':
            return {
                casosEspera: state.casosEspera,
                loading: false    
            }
        case 'NEW_CASO_SUCCESS':
            return {
                casosEspera: [action.caso,...state.casosEspera],
                loading: false    
            }
        case 'GET_CASOS_REQUEST':
        return {
            ...state,
            loading: true
        }
        case 'GET_CASOS_SUCCESS':
        return {
            ...state,
            loading: false,
            casosEspera: action.casosEspera
        }
        case 'GET_CASOS_FAILURE':
        return {
            ...state,
            loading: false,
            error: action.error
        }
        case 'ACCEPT_CASO_REQUEST':
            return {
                casosEspera: state.casosEspera,
                loading: true    
            }
        case 'ACCEPT_CASO_FAILURE':
            return {
                casosEspera: state.casosEspera,
                loading: false    
            }
        case 'ACCEPT_CASO_SUCCESS':
            return {
                casosEspera: [action.caso,...state.casosEspera],
                loading: false    
            }
        default:
            return state
            
    }

}

export default exampleReducer