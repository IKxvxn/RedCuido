
const DEFAULT_STATE = {
    casosRechazados: [],
    loading: false,
}

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
        console.log(action.caso)
        var casos= state.casosRechazados.map((caso) => {
            if(caso._id=== action.caso._id){return action.caso}
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
        default:
            return state
            
    }

}

export default rechazadosReducer