
import cx from 'classnames'
import { Icon } from 'antd'
import { IoEdit, IoLoadC, IoIosPlusEmpty } from 'react-icons/lib/io'
import { Loader } from '../../components'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Card , CardHeader, CardActions, CardText } from 'material-ui'

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

        if (loading) {
            return (
                <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Loader/>
                </div>
            )
        }

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>

                <a onClick={this.handlesCreateLandscapeClick}>
                    <IoIosPlusEmpty size={30}/>
                </a>

                <ul>
                    {
                        landscapes.map((landscape, i) =>
                        <Card key={i} style={{ width: 300, margin: '20px', float: 'left' }}>
                                <CardHeader
                                    title={landscape.name}
                                    subtitle="Subtitle"
                                />
                                <CardActions>
                                    <div>
                                        <a onClick={this.handlesEditLandscapeClick.bind(this, landscape)}>
                                            <IoEdit/>
                                        </a>
                                        <a onClick={this.handlesLandscapeClick.bind(this, landscape)}>
                                            <IoLoadC/>
                                        </a>
                                    </div>
                                </CardActions>

                                <CardText>
                                    {landscape.description}
                                </CardText>
                        </Card>)
                    }
                </ul>
            </div>
        )
    }

    handlesCreateLandscapeClick = event => {
        const { router } = this.context
        router.push({ pathname: '/landscapes/create' })
    }

    handlesEditLandscapeClick = (landscape, event) => {
        const { router } = this.context
        router.push({ pathname: '/landscapes/edit/' + landscape._id })
    }

    handlesLandscapeClick = (landscape, event) => {
        const { router } = this.context
        router.push({ pathname: '/landscape/' + landscape._id })
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
