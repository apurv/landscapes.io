
import cx from 'classnames'
import { Card, Icon } from 'antd'
import { Loader } from '../../components'
import React, { Component, PropTypes } from 'react'
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
        const { loading, landscapes } = this.props

        // if (this.props.landscapes) {
        //     console.log('%c landscapes ', 'background: #1c1c1c; color: deeppink', landscapes)
        // }

        if (loading) {
            return (
                <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Loader/>
                </div>
            )
        }

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                <ul>
                    {
                        landscapes.map((landscape, i) =>
                        <Card key={i} title={landscape.name} style={{ width: 300, margin: '20px', float: 'left' }}
                            extra={
                                <a onClick={this.handlesLandscapeClick}><Icon style={{ fontSize: '20px' }} type='loading'/></a>
                            }>
                            <p>{landscape.description}</p>
                        </Card>)
                    }
                </ul>
            </div>
        )
    }

    handlesLandscapeClick = event => {
        const { router } = this.context
        router.push({ pathname: '/protected' })
    }
}

Landscapes.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterLandscapes: PropTypes.func.isRequired,
    leaveLandscapes: PropTypes.func.isRequired
}

Landscapes.contextTypes = {
    router: PropTypes.object
}

export default Landscapes
