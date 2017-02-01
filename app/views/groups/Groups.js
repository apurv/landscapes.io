
import cx from 'classnames'
import { Icon } from 'antd'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import FlatButton from 'material-ui/FlatButton';
import { Loader } from '../../components'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { auth } from '../../services/auth'

class Groups extends Component {

    state = {
        animated: true,
        viewEntersAnim: true
    }

    static childContextTypes =
      {
          muiTheme: React.PropTypes.object
      }

      getChildContext()
      {
          return {
              muiTheme: getMuiTheme()
          }
      }

    componentDidMount() {
        const { enterGroups } = this.props
        enterGroups()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
        const { leaveGroups } = this.props
        leaveGroups()
    }

    render() {
        const { animated, viewEntersAnim } = this.state
        const { loading, groups } = this.props
        console.log('GROUPS - ', groups)

        let stateGroups = groups || []
        const user = auth.getUserInfo();

        if(user.role !== 'admin'){
          if(groups){
            stateGroups = []
            groups.map(group => group.users.map(user => {
              console.log('userID', user.userId)
              if(user.userId === auth.getUserInfo()._id){
                stateGroups.push(group)
              }
              })
            )
          // viewLandscapes.filter(landscape)
            console.log('stateGroups', stateGroups)
          }
        }



        if (loading) {
            return (
                <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Loader/>
                </div>
            )
        }

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                <a onClick={this.handlesCreateGroupClick}>
                    <p style={{ fontSize: '20px' }}><Icon style={{ fontSize: '20px' }} type='plus'/> Add Group</p>
                </a>

                <ul>
                    {
                      stateGroups.map((group, i) =>
                      <Card key={i} style={{ width: 300, margin: '20px', float: 'left' }}>
                          <CardHeader
                            title={group.name}
                            onClick={this.handlesGroupClick.bind(this, group)}
                          />
                          <CardText onClick={this.handlesGroupClick.bind(this, group)}>
                                {group.description}
                          </CardText>
                          <CardActions>
                            <FlatButton onClick={this.handlesEditGroupClick.bind(this, group)}>
                              <a onClick={this.handlesEditGroupClick.bind(this, group)}>
                                <Icon style={{ fontSize: '20px' }} type='edit'/> EDIT
                              </a>
                            </FlatButton>
                          </CardActions>
                      </Card>
                      )
                    }
                </ul>
            </div>
        )
    }

    handlesCreateGroupClick = event => {
        const { router } = this.context
        router.push({ pathname: '/groups/create' })
    }

    handlesEditGroupClick = (group, event) => {
        const { router } = this.context
        router.push({ pathname: '/groups/edit/' + group._id })
    }

    handlesGroupClick = (group, event) => {
        const { router } = this.context
        router.push({ pathname: '/groups/' + group._id })
    }
}

Groups.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterGroups: PropTypes.func.isRequired,
    leaveGroups: PropTypes.func.isRequired
}

Groups.contextTypes = {
    router: PropTypes.object
}

export default Groups
