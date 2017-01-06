import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import * as reducers from '../modules/reducers'
import { routerReducer } from 'react-router-redux'
import { apolloClient } from '../../services/apollo'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'

const loggerMiddleware = createLogger({ level: 'info', collapsed: true })

// createStore : enhancer
const enhancer = compose(
    applyMiddleware(thunkMiddleware, apolloClient.middleware(), // apollo middleware
    loggerMiddleware) // logger after thunk to avoid undefined actions
)

// combine reducers
const reducer = combineReducers({
    ...reducers,
    apollo: apolloClient.reducer(), // apollo reducer
    routing: routerReducer
})

// export default = redux store
export default function configureStore(initialState) {
    return createStore(reducer, initialState, enhancer)
}

// export apollo client
export const client = apolloClient
