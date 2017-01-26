import React from 'react'
import { auth } from '../services/auth'
import { PageNotFound } from '../views'
import { ApolloProvider } from 'react-apollo'
import { syncHistoryWithStore } from 'react-router-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import DevTools from '../redux/devTools/DevTools.jsx'
import configureStore, { client } from '../redux/store/configureStore'

import {
    // app
    App,

    // non protected views
    ConnectedHome,
    ConnectedLogin,
    ConnectedRegister,
    ConnectedPasswordChange,
    // protected views
    ConnectedProtected,
    ConnectedDeployments,
    ConnectedLandscapes,
    ConnectedCreateLandscape,
    ConnectedEditLandscape,
    ConnectedLandscapeDetails
} from '../containers'

const store = configureStore()
const syncedHistory = syncHistoryWithStore(browserHistory, store)

export const Routes = () => {
    return (
        <ApolloProvider store={store} client={client}>
            <div>
                <Router history={syncedHistory}>
                    <Route path="/" component={App}>
                        {/* non protected views */}
                        <IndexRoute component={ConnectedHome}/>
                        <Route path="/deployments/*" component={ConnectedDeployments} onEnter={requireAuth}/>
                        <Route path="/landscape/:id" component={ConnectedLandscapeDetails} onEnter={requireAuth}/>
                        <Route path="/landscapes/create" component={ConnectedCreateLandscape} onEnter={requireAuth}/>
                        <Route path="/landscapes/edit/:id" component={ConnectedEditLandscape} onEnter={requireAuth}/>
                        <Route path="/landscapes" component={ConnectedLandscapes} onEnter={requireAuth}/>
                        <Route path="/login" component={ConnectedLogin}/>
                        <Route path="/register" component={ConnectedRegister}/> {/* logout: just redirects to home (App will take care of removing the token) */}
                        <Route path="/logout" onEnter={logOutUser}/> {/* protected views */}
                        <Route path="/protected" component={ConnectedProtected} onEnter={requireAuth}/> {/* page not found */}
                        <Route path="/changePassword" component={ConnectedPasswordChange} onEnter={requireAuth}/> {/* page not found */}
                        <Route path="*" component={PageNotFound}/>
                    </Route>
                </Router>
                {process.env.NODE_ENV !== 'production'
                    ? <DevTools/>
                    : null}
            </div>
        </ApolloProvider>
    )
}

// authentication check to access protected routes
function requireAuth(nextState, replace) {

    const user = auth.getUserInfo()
        ? auth.getUserInfo()
        : null

    const isAuthenticated = (auth.getToken() && checkUserHasId(user))
        ? true
        : false

    if (!isAuthenticated) {
        replace({
            pathname: '/login',
            state: {
                nextPathname: nextState.location.pathname
            }
        })
    }
}

function logOutUser(nextState, replace) {
    replace({
        pathname: '/',
        state: {
            nextPathname: nextState.location.pathname
        }
    })
}

function checkUserHasId(user) {
    return user && user._id && (user._id.length > 0)
}
