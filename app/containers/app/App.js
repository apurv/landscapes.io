import React, { Component, PropTypes } from 'react'
import { NavigationBar, BackToTop } from '../../components'
import navigationModel from '../../models/navigation.json'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as viewsActions from '../../redux/modules/views'
import * as userAuthActions from '../../redux/modules/userAuth'

class App extends Component {

    state = {
        navModel: navigationModel
    }

    componentDidMount() {
        const { actions: { checkIfUserIsAuthenticated } } = this.props

        checkIfUserIsAuthenticated()
    }

    render() {
        const { navModel } = this.state
        const { children, user, userIsAuthenticated } = this.props

        return (
            <div id='appContainer'>
                <NavigationBar brand={navModel.brand} navModel={navModel} user={user} userIsAuthenticated={userIsAuthenticated}
                    handleLeftNavItemClick={this.handleLeftNavItemClick} handleRightNavItemClick={this.handleRightNavItemClick}/>
                <h1></h1>
                <div className='container-fluid'>
                    {children}
                </div>
                <BackToTop minScrollY={40} scrollTo={'appContainer'}/>
            </div>
        )
    }

    handleLeftNavItemClick = (event, viewName) => {
        if (viewName === 'logout') {
            const {actions: {
                    setUserLogout
                }} = this.props
            setUserLogout()
        }
    }

    handleRightNavItemClick = (event, viewName) => {
        if (viewName === 'logout') {
            const {actions: {
                    setUserLogout
                }} = this.props
            setUserLogout()
        }
    }
}

App.propTypes = {
    children: PropTypes.node,
    history: PropTypes.object,
    location: PropTypes.object,
    actions: PropTypes.object,

    user: PropTypes.object,
    userIsAuthenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => {
    return {
        // userAuth:
        user: state.userAuth,
        userIsAuthenticated: state.userAuth.isAuthenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({
            ...viewsActions,
            ...userAuthActions
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
