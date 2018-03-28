
const DEFAULT_STATE = {
    casosExcluidos: [],
    loading: false,
}

const exampleReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'NEW_CASO_REQUEST':
            return {
                casosExcluidos: state.casosExcluidos,
                loading: true    
            }
        case 'NEW_CASO_FAILURE':
            return {
                casosExcluidos: state.casosExcluidos,
                loading: false    
            }
        case 'NEW_CASO_SUCCESS':
            return {
                casosExcluidos: [action.caso,...state.casosExcluidos],
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
            casosExcluidos: action.casosExcluidos
        }
        case 'GET_CASOS_FAILURE':
        return {
            ...state,
            loading: false,
            error: action.error
        }
        default:
            return state
            
    }

}

export default exampleReducer