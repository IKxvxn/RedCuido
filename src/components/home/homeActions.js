const EXAMPLE_DISPATCH = 'EXAMPLE_DISPATCH'

export function ExampleFunction() {
  return function (dispatch) {
    dispatch({
      type: EXAMPLE_DISPATCH
    })
  }
}


export const template = () => {
    return {

    }
  }