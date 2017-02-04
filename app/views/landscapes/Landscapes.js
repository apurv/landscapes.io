import cx from 'classnames'
import axios from 'axios'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Row, Col } from 'react-flexbox-grid'
import { IoEdit, IoIosCloudUploadOutline, IoIosPlusEmpty } from 'react-icons/lib/io'
import { Paper , CardHeader, CardActions, CardText, FlatButton } from 'material-ui'

import './landscapes.style.scss'
import { Loader } from '../../components'
import { auth } from '../../services/auth'

class Landscapes extends Component {

    state = {
        animated: true,
        viewEntersAnim: true
    }

    componentDidMount() {
        const { enterLandscapes } = this.props
        enterLandscapes()
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps invoked', nextProps)

        const { landscapes } = nextProps
        let viewLandscapes = landscapes || []

        function StatusModel() {
            this.pending = 0
            this.running = 0
            this.errored = 0
            this.deleted = 0
        }

        console.log('%c viewLandscapes ', 'background: #1c1c1c; color: yellow', viewLandscapes)

        if (viewLandscapes.length) {

            // instantiate statuses
            // viewLandscapes.forEach(landscape => {
            //     landscape.status = new StatusModel()
            // })

            // let _promises = viewLandscapes.map(landscape => {
            //     return this.props.deploymentsByLandscapeId({
            //         variables: { landscapeId: landscape._id }
            //     })
            // })

            // return Promise.all(_promises).then(data => {
            //     console.log('%c fata ', 'background: #1c1c1c; color: limegreen', data)
            //     data.forEach((_data, i) => {
            //         viewLandscapes[i].deployments = _data.data.deploymentsByLandscapeId
            //     })
            //
            //     viewLandscapes.forEach(ls => {
            //         let statusPromises = ls.deployments.map(deployment => {
            //             return this.props.deploymentStatus({
            //                 variables: { deployment }
            //             })
            //         })
            //     })
            //
            // })

            /////////// STATUS ////////////

            // let landscapesDetails = []
            //
            // // instantiate statuses
            // viewLandscapes.forEach(landscape => {
            //     landscape.status = new StatusModel()
            // })
            //
            // // create promise array to gather all deployments
            // var _promises = viewLandscapes.map((landscape, index) => {
            //     return new Promise(function (resolve, reject) {
            //         axios.get('http://localhost:9000/api/landscapes/' + landscape._id + '/deployments').then(res => {
            //             console.log('%c RES ', 'background: #1c1c1c; color: limegreen', res)
            //             resolve(res)
            //         }).catch(err => {
            //             console.log(err)
            //             reject(err)
            //         })
            //     })
            // })
            //
            // Promise.all(_promises).then(function (landscapes) {
            //     console.log('%c LAND ', 'background: #1c1c1c; color: limegreen', landscapes)
            //     landscapesDetails = landscapes
            // })
        }
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
        const { loading, landscapes, users, groups } = this.props
        const user = auth.getUserInfo()

        let userGroups = [],
            userLandscapes = {}

        let viewLandscapes = landscapes || []

        if (user.role !== 'admin') {
            if (groups) {
                groups.map(group => group.users.map(user => {
                    console.log(user.userId)
                    if (user.userId === auth.getUserInfo()._id) {
                        userGroups.push(group)
                        if (landscapes) {
                            landscapes.map(landscape => {
                                group.landscapes.map(landscapeId => {
                                    if (landscapeId === landscape._id) {
                                        userLandscapes[landscapeId] = landscape
                                    }
                                })
                            })
                        }
                    }
                }))

                viewLandscapes = Object.keys(userLandscapes).map(key => {
                    return userLandscapes[key]
                })
            }
        }

        if (loading) {
            return (
                <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Loader/>
                </div>
            )
        }

        console.log('%c viewLandscapes ', 'background: #1c1c1c; color: rgb(209, 29, 238)', viewLandscapes)

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>

                <a onClick={this.handlesCreateLandscapeClick}>
                    <p style={{ fontSize: '20px' }}><IoIosPlusEmpty size={30}/>Add Landscape</p>
                </a>

                <ul>
                    {
                        viewLandscapes.map((landscape, i) =>

                        <Paper key={i} className={cx({ 'landscape-card': true })} zDepth={3} rounded={false} onClick={this.handlesLandscapeClick.bind(this, landscape)}>
                                {/* header */}
                                <Row start='xs' middle='xs' style={{ padding: '20px 0px' }}>
                                    <Col xs={4}>
                                        <img id='landscapeIcon' src={landscape.imageUri}/>
                                    </Col>
                                    <Col xs={4}>
                                        <span>{landscape.name}</span>
                                    </Col>
                                    <Col xs={4}>
                                        <FlatButton id='landscape-edit' onTouchTap={this.handlesEditLandscapeClick.bind(this, landscape)}
                                            label='Edit' labelStyle={{ fontSize: '10px' }} icon={<IoEdit/>}/>
                                        <FlatButton id='landscape-deploy' onTouchTap={this.handlesDeployClick.bind(this, landscape)}
                                            label='Deploy' labelStyle={{ fontSize: '10px' }} icon={<IoIosCloudUploadOutline/>}/>
                                    </Col>
                                </Row>

                                <Row bottom='xs' style={{ margin: '0px', fontSize: '12px', minHeight: '76px' }}>
                                    {/* {landscape.description} */}
                                    <Col xs={9}>
                                        <Row center='xs'>
                                            <Col xs={2} style={{ fontSize: '10px', color: 'grey' }}>
                                                99
                                                <div style={{ background: 'limegreen', width: '100%', height: '5px' }} />
                                            </Col>
                                            <Col xs={2} style={{ fontSize: '10px', color: 'grey' }}>
                                                99
                                                <div style={{ background: 'deepskyblue', width: '100%', height: '5px' }} />
                                            </Col>
                                            <Col xs={2} style={{ fontSize: '10px', color: 'grey' }}>
                                                99
                                                <div style={{ background: 'yellow', width: '100%', height: '5px' }} />
                                            </Col>
                                            <Col xs={2} style={{ fontSize: '10px', color: 'grey' }}>
                                                99
                                                <div style={{ background: 'red', width: '100%', height: '5px' }} />
                                            </Col>
                                            <Col xs={2} style={{ fontSize: '10px', color: 'grey' }}>
                                                99
                                                <div style={{ background: 'grey', width: '100%', height: '5px' }} />
                                            </Col>
                                            <Col xs={2} style={{ fontSize: '10px', color: 'grey' }}></Col>
                                        </Row>
                                    </Col>
                                    <Col xs={3}>
                                        {/* <img style={{ filter: 'hue-rotate(-30deg) brightness(1)' }} height='50px' src='/public/untitled.png'/> */}
                                    </Col>
                                </Row>

                        </Paper>)
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

    handlesDeployClick = (landscape, event) => {
        const { router } = this.context
        router.push({ pathname: `/landscape/${landscape._id}/deployments/create` })
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
