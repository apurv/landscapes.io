import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import shallowCompare from 'react-addons-shallow-compare'

class Landscapes extends Component {

    state = {
        animated: true,
        viewEntersAnim: true
    }

    componentDidMount() {
        const { enterLandscapes } = this.props
        enterLandscapes()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
        const { leaveLandscapes } = this.props
        leaveLandscapes()
    }

    render() {
        const { animated, viewEntersAnim } = this.state

        if (this.props.loading) {
            return (
                <div className={cx({'animatedViews': animated, 'view-enter': viewEntersAnim})}>
                    <h1>Loading</h1>
                </div>
            )
        } else {
            return (
                <div className={cx({'animatedViews': animated, 'view-enter': viewEntersAnim})}>
                    <ul>
                        {
                            this.props.landscapes.map((landscape, i) =>
                                <li key={i}>
                                    {landscape.name}
                                </li>)
                        }
                    </ul>
                </div>
            )
        }
    }
}

Landscapes.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterLandscapes: PropTypes.func.isRequired,
    leaveLandscapes: PropTypes.func.isRequired
}

export default Landscapes
