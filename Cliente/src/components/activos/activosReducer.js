
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
        default:
            return state
            
    }

}

export default activosReducer