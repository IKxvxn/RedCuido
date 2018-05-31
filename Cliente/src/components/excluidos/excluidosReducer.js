
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
        }
        case 'EDIT_EXCLUIDO_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'EDIT_EXCLUIDO_SUCCESS':
        var casos= state.casosExcluidos.map((caso) => {
            if(caso._id=== action.caso._id){return {...action.caso}}
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
        }
        case 'REACTIVATE_EXCLUIDO_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'REACTIVATE_EXCLUIDO_SUCCESS':
        return {
            ...state,
            casosExcluidos: state.casosExcluidos.filter(item => {return item._id !== action.id;}),
            loading: false
            }
        case 'REACTIVATE_EXCLUIDO_FAILURE':
        return {
          ...state,
          loading: false,
        }
        case 'DELETE_EXCLUIDO_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'DELETE_EXCLUIDO_SUCCESS':
        return {
            ...state,
            casosExcluidos: state.casosExcluidos.filter(item => {return item._id !== action.id;}),
            loading: false
            }
        case 'DELETE_EXCLUIDO_FAILURE':
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
            casosExcluidos: [],
            loading: false,
        }
        default:
            return state
            
    }

}

export default excluidosReducer