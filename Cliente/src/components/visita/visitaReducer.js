
const DEFAULT_STATE = {
    casosVisita: [],
    loading: false,
}

//Segun la accion de visitaActions se modifica el reducer
const visitaReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'NEW_VISITA_REQUEST':
            return {
                casosVisita: state.casosVisita,
                loading: true    
            }
        case 'NEW_VISITA_FAILURE':
            return {
                casosVisita: state.casosVisita,
                loading: false    
            }
        case 'NEW_VISITA_SUCCESS':
            return {
                casosVisita: [action.caso,...state.casosVisita],
                loading: false    
            }
        case 'GET_VISITA_REQUEST':
        return {
            ...state,
            loading: true
        }
        case 'GET_VISITA_SUCCESS':
        return {
            ...state,
            loading: false,
            casosVisita: action.casosVisita
        }
        case 'GET_VISITA_FAILURE':
        return {
            ...state,
            loading: false,
            error: action.error
        }
        case 'EDIT_VISITA_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'EDIT_VISITA_SUCCESS':
        var casos= state.casosVisita.map((caso) => {
            if(caso._id=== action.caso._id){return {...action.caso}}
            else{return {...caso,key:caso._id}}})
        return {
            ...state,
            casosVisita: casos,
            loading: false
            }
        case 'EDIT_VISITA_FAILURE':
        return {
          ...state,
          loading: false,
          caso: {},
          error: action.error
        }
        case 'ACCEPT_VISITA_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'ACCEPT_VISITA_SUCCESS':
        return {
            ...state,
            casosVisita: state.casosVisita.filter(item => {return item._id !== action.id;}),
            loading: false
            }
        case 'ACCEPT_VISITA_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.error
        }
        case 'REJECT_VISITA_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'REJECT_VISITA_SUCCESS':
        return {
            ...state,
            casosVisita: state.casosVisita.filter(item => {return item._id !== action.id;}),
            loading: false
            }
        case 'REJECT_VISITA_FAILURE':
        return {
          ...state,
          loading: false,
        }
        case 'DELETE_VISITA_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'DELETE_VISITA_SUCCESS':
        return {
            ...state,
            casosVisita: state.casosVisita.filter(item => {return item._id !== action.id;}),
            loading: false
            }
        case 'DELETE_VISITA_FAILURE':
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
          error: action.error
        }
        case 'LOGOUT':
        return{
            casosVisita: [],
            loading: false,
        }
        default:
            return state
    }

}

export default visitaReducer