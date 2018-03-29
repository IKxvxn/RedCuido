
const DEFAULT_STATE = {
    casosActivos: [],
    loading: false,
}

const activosReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'NEW_ACTIVO_REQUEST':
            return {
                casosActivos: state.casosActivos,
                loading: true    
            }
        case 'NEW_ACTIVO_FAILURE':
            return {
                casosActivos: state.casosActivos,
                loading: false    
            }
        case 'NEW_ACTIVO_SUCCESS':
            return {
                casosActivos: [action.caso,...state.casosActivos],
                loading: false    
            }
        case 'GET_ACTIVOS_REQUEST':
        return {
            ...state,
            loading: true
        }
        case 'GET_ACTIVOS_SUCCESS':
        return {
            ...state,
            loading: false,
            casosActivos: action.casosActivos
        }
        case 'GET_ACTIVOS_FAILURE':
        return {
            ...state,
            loading: false,
            error: action.error
        }
        default:
            return state
            
    }

}

export default activosReducer