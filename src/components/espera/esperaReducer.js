
const DEFAULT_STATE = {
    exampleReducer: []
}

const exampleReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'EXAMPLE_DISPATCH':
            return {exampleReducerx: []}
        default:
            return state
            
    }

}

export default exampleReducer