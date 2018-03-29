import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import ReduxThunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import loginReducer from './components/login/loginReducer'
import esperaReducer from './components/espera/esperaReducer'
import activosReducer from './components/activos/activosReducer'
import excluidosReducer from './components/excluidos/excluidosReducer'
import rechazadosReducer from './components/rechazados/rechazadosReducer'

const logger = createLogger({
  collapsed: true,
  duration: true,
  diff: true,
})

const Store = createStore(combineReducers({loginReducer:loginReducer,esperaReducer:esperaReducer,activosReducer:activosReducer,excluidosReducer:excluidosReducer,rechazadosReducer:rechazadosReducer}),
composeWithDevTools(
  applyMiddleware(
    ReduxThunk,
    logger
  ),
))

export default Store