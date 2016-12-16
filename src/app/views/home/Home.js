import React, { Component, PropTypes } from 'react'
import { Jumbotron } from '../../components'
import cx from 'classnames'
import shallowCompare from 'react-addons-shallow-compare'
import { Link } from 'react-router'

class Home extends Component {

    state = {
        animated: true,
        viewEntersAnim: true
    }

    componentDidMount() {
        const { enterHome } = this.props
        enterHome()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
        const { leaveHome } = this.props
        leaveHome()
    }

    render() {
        const { animated, viewEntersAnim } = this.state
        return (
            <div key='homeView' className={cx({'animatedViews': animated, 'view-enter': viewEntersAnim})}>
                <Jumbotron>
                    <h1>Landscapes.io</h1>

                    <p>
                        <Link className='btn btn-primary btn-md' to={'/login'}>Login</Link>
                    </p>
                </Jumbotron>
            </div>
        )
    }
}

Home.propTypes = {
    // view props:
    currentView: PropTypes.string.isRequired,
    // view actions:
    enterHome: PropTypes.func.isRequired,
    leaveHome: PropTypes.func.isRequired
}

export default Home
