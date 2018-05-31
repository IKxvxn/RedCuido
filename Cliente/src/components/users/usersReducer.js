
const DEFAULT_STATE = {
    casosUser: [],
    loading: false,
}

//Se definen los actions utilizados en el userActions.
//Se guardan los cambios en el reducer
const userReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'NEW_USER_REQUEST':
            return {
                casosUser: state.casosUser,
                loading: true    
            }
        case 'NEW_USER_FAILURE':
            return {
                casosUser: state.casosUser,
                loading: false    
            }
        case 'NEW_USER_SUCCESS':
            return {
                casosUser: [action.caso,...state.casosUser],
                loading: false    
            }
        case 'GET_USER_REQUEST':
        return {
            ...state,
            loading: true
        }
        case 'GET_USER_SUCCESS':
        return {
            ...state,
            loading: false,
            casosUser: action.casosUser
        }
        case 'GET_USER_FAILURE':
        return {
            ...state,
            loading: false,
        }
        case 'EDIT_USER_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'EDIT_USER_SUCCESS':
        var casos= state.casosUser.map((caso) => {
            if(caso._id=== action.caso._id){return {...action.caso}}
            else{return {...caso,key:caso._id}}})
        return {
            ...state,
            casosUser: casos,
            loading: false
            }
        case 'EDIT_USER_FAILURE':
        return {
          ...state,
          loading: false,
        }
        case 'DELETE_USER_REQUEST':
        return {
          ...state,
          loading: true      
        }
        case 'DELETE_USER_SUCCESS':
        return {
            ...state,
            casosUser: state.casosUser.filter(item => {return item._id !== action.id;}),
            loading: false
            }
        case 'DELETE_USER_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.error
        }
        case 'LOGOUT':
        return{
            casosUser: [],
            loading: false,
        }
        default:
            return state
            
    }

}

export default userReducer