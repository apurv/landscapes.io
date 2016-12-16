import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import shallowCompare from 'react-addons-shallow-compare'

class About extends Component {

    state = {
        animated: true,
        viewEntersAnim: true
    }

    componentDidMount() {
        const { enterAbout } = this.props
        enterAbout()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
        const { leaveAbout } = this.props
        leaveAbout()
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

About.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterAbout: PropTypes.func.isRequired,
    leaveAbout: PropTypes.func.isRequired
}

export default About
