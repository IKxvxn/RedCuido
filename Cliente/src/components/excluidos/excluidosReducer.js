
const DEFAULT_STATE = {
    casosExcluidos: [],
    loading: false,
}

const excluidosReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'NEW_EXCLUIDO_REQUEST':
            return {
                casosExcluidos: state.casosExcluidos,
                loading: true    
            }
        case 'NEW_EXCLUIDO_FAILURE':
            return {
                casosExcluidos: state.casosExcluidos,
                loading: false    
            }
        case 'NEW_EXCLUIDO_SUCCESS':
            return {
                casosExcluidos: [action.caso,...state.casosExcluidos],
                loading: false    
            }
        case 'GET_EXCLUIDOS_REQUEST':
        return {
            ...state,
            loading: true
        }
        case 'GET_EXCLUIDOS_SUCCESS':
        return {
            ...state,
            loading: false,
            casosExcluidos: action.casosExcluidos
        }
        case 'GET_EXCLUIDOS_FAILURE':
        return {
            ...state,
            loading: false,
            error: action.error
        }
        case 'EDIT_EXCLUIDO_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'EDIT_EXCLUIDO_SUCCESS':
        console.log(action.caso)
        var casos= state.casosExcluidos.map((caso) => {
            if(caso._id=== action.caso._id){return action.caso}
            else{return {...caso,key:caso._id}}})
        return {
            ...state,
            casosExcluidos: casos,
            loading: false
            }
        case 'EDIT_EXCLUIDO_FAILURE':
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

export default excluidosReducer