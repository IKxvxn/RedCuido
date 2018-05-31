
const DEFAULT_STATE = {
    casosRechazados: [],
    loading: false,
}

//Segun la accion de rechazadosActions, modifica el reducer (lista de rechazados)
const rechazadosReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'NEW_RECHAZADO_REQUEST':
            return {
                casosRechazados: state.casosRechazados,
                loading: true    
            }
        case 'NEW_RECHAZADO_FAILURE':
            return {
                casosRechazados: state.casosRechazados,
                loading: false    
            }
        case 'NEW_RECHAZADO_SUCCESS':
            return {
                casosRechazados: [action.caso,...state.casosRechazados],
                loading: false    
            }
        case 'GET_RECHAZADO_REQUEST':
        return {
            ...state,
            loading: true
        }
        case 'GET_RECHAZADO_SUCCESS':
        return {
            ...state,
            loading: false,
            casosRechazados: action.casosRechazados
        }
        case 'GET_RECHAZADO_FAILURE':
        return {
            ...state,
            loading: false,
            error: action.error
        }
        case 'EDIT_RECHAZADO_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'EDIT_RECHAZADO_SUCCESS':
        var casos= state.casosRechazados.map((caso) => {
            if(caso._id=== action.caso._id){return {...action.caso}}
            else{return {...caso,key:caso._id}}})
        return {
            ...state,
            casosRechazados: casos,
            loading: false
            }
        case 'EDIT_RECHAZADO_FAILURE':
        return {
          ...state,
          loading: false,
          caso: {},
          error: action.error
        }
        case 'REACTIVATE_RECHAZADO_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'REACTIVATE_RECHAZADO_SUCCESS':
        return {
            ...state,
            casosRechazados: state.casosRechazados.filter(item => {return item._id !== action.id;}),
            loading: false
            }
        case 'REACTIVATE_RECHAZADO_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.error
        }
        case 'DELETE_RECHAZADO_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'DELETE_RECHAZADO_SUCCESS':
        return {
            ...state,
            casosRechazados: state.casosRechazados.filter(item => {return item._id !== action.id;}),
            loading: false
            }
        case 'DELETE_RECHAZADO_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.error
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
            casosRechazados: [],
            loading: false,
        }
        default:
            return state
            
    }

}

export default rechazadosReducer