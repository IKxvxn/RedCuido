import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import ReduxThunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import loginReducer from './components/login/loginReducer'
import esperaReducer from './components/espera/esperaReducer'
import visitaReducer from './components/visita/visitaReducer'
import activosReducer from './components/activos/activosReducer'
import excluidosReducer from './components/excluidos/excluidosReducer'
import userReducer from './components/users/usersReducer'
import rechazadosReducer from './components/rechazados/rechazadosReducer'
import homeReducer from './components/home/homeReducer'

const logger = createLogger({
  collapsed: true,
  duration: true,
  diff: true,
})

const Store = createStore(combineReducers({loginReducer:loginReducer,homeReducer:homeReducer,userReducer:userReducer,esperaReducer:esperaReducer,visitaReducer:visitaReducer,activosReducer:activosReducer,excluidosReducer:excluidosReducer,rechazadosReducer:rechazadosReducer}),
composeWithDevTools(
  applyMiddleware(
    ReduxThunk,
    logger
  ),
))

export default Store