
import cx from 'classnames'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Row, Col } from 'react-flexbox-grid'
import { IoEdit, IoLoadC, IoIosPlusEmpty } from 'react-icons/lib/io'
import { Card , CardHeader, CardActions, CardText } from 'material-ui'
import { auth } from '../../services/auth'

import './landscapes.style.scss'
import { Loader } from '../../components'

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
        const { loading, landscapes, users, groups } = this.props

        var viewLandscapes = landscapes || []
        const user = auth.getUserInfo();
        var userGroups = []
        let userLandscapes = {};
        if(user.role !== 'admin'){
          if(groups){
            groups.map(group => group.users.map(user => {
              console.log(user.userId)
              if(user.userId === auth.getUserInfo()._id){
                userGroups.push(group)
                if(landscapes){
                  landscapes.map(landscape => {
                      group.landscapes.map(landscapeId =>{
                        if(landscapeId === landscape._id){
                          userLandscapes[landscapeId] = landscape;
                        }
                      })
                  })
                }
              }
            })
          )
          // viewLandscapes.filter(landscape)
          console.log('userGroups', userGroups)
          console.log('userLandscapes', userLandscapes)
          viewLandscapes = Object.keys(userLandscapes).map(key => {return userLandscapes[key]})
        }
        }

        console.log(viewLandscapes)

        console.log(this.props)

        console.log('user', user)

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
                    <p style={{ fontSize: '20px' }}><IoIosPlusEmpty size={30}/>Add Landscape</p>
                </a>

                <ul>
                    {
                        viewLandscapes.map((landscape, i) =>
                        // onClick={this.handlesLandscapeClick.bind(this, landscape)}
                        <Card key={i} className={cx({ 'landscape-card': true })} >
                                {/* header */}
                                <Row start='xs' middle='xs' style={{ padding: '20px 0px' }}>
                                    <Col xs={4}>
                                        <img id='landscapeIcon' src={landscape.imageUri}/>
                                    </Col>
                                    <Col xs={4}>
                                        <span>{landscape.name}</span>
                                    </Col>
                                    <Col xs={4}>
                                    </Col>
                                </Row>
                                <CardActions>
                                    <div>
                                        <a style={{zIndex:5}} onClick={this.handlesEditLandscapeClick.bind(this, landscape)}>
                                            <IoEdit/>
                                        </a>
                                        <a style={{zIndex:5}} onClick={this.handlesLandscapeClick.bind(this, landscape)}>
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
