
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
                loading: true    
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
        }
        case 'EDIT_ACTIVO_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'EDIT_ACTIVO_SUCCESS':
        var casos= state.casosActivos.map((caso) => {
            if(caso._id=== action.caso._id){return {...action.caso}}
            else{return {...caso,key:caso._id}}})
        return {
            ...state,
            casosActivos: casos,
            loading: false
            }
        case 'EDIT_ACTIVO_FAILURE':
        return {
          ...state,
          loading: false,
        }
        case 'EXCLUDE_CASO_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'EXCLUDE_CASO_SUCCESS':
        return {
            ...state,
            casosActivos: state.casosActivos.filter(item => {return item._id !== action.id;}),
            loading: false
            }
        case 'EXCLUDE_CASO_FAILURE':
        return {
          ...state,
          loading: false,
        }
        case 'DELETE_ACTIVO_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'DELETE_ACTIVO_SUCCESS':
        return {
            ...state,
            casosActivos: state.casosActivos.filter(item => {return item._id !== action.id;}),
            loading: false
            }
        case 'DELETE_ACTIVO_FAILURE':
        return {
          ...state,
          loading: false,
        }
        case 'DELETE_FILES_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'DELETE_FILES_SUCCESS':
        return {
            ...state,
            loading: false
            }
        case 'DELETE_FILES_FAILURE':
        return {
          ...state,
          loading: false,
        }
        case 'LOGOUT':
        return{
            casosActivos: [],
            loading: false,
        }
        default:
            return state
    }

}

export default activosReducer