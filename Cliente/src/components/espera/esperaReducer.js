
const DEFAULT_STATE = {
    casosEspera: [],
    loading: false,
}

const esperaReducer = (state = DEFAULT_STATE, action) => {
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
        case 'EDIT_CASO_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'EDIT_CASO_SUCCESS':
        console.log(action.caso)
        var casos= state.casosEspera.map((caso) => {
            if(caso._id=== action.caso._id){return action.caso}
            else{return {...caso,key:caso._id}}})
        return {
            ...state,
            casosEspera: casos,
            loading: false
            }
        case 'EDIT_CASO_FAILURE':
        return {
          ...state,
          loading: false,
          caso: {},
          error: action.error
        }
        case 'ACCEPT_CASO_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'ACCEPT_CASO_SUCCESS':
        return {
            ...state,
            casosEspera: state.casosEspera.filter(item => {return item._id !== action.id;}),
            loading: false
            }
        case 'ACCEPT_CASO_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.error
        }
        default:
            return state
            
    }

}

export default esperaReducer