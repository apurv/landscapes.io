import cx from 'classnames'
import { Card, Icon } from 'antd'
import { Loader } from '../../components'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

class Users extends Component {

    state = {
        animated: true,
        viewEntersAnim: true
    }

    componentDidMount() {
        const { enterUsers } = this.props
        enterUsers()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
        const { leaveUsers } = this.props
        leaveUsers()
    }

    render() {
        const { animated, viewEntersAnim } = this.state
        const { loading, users } = this.props
        console.log('USERS - ', users)
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
                    <p style={{ fontSize: '20px' }}><Icon style={{ fontSize: '20px' }} type='plus'/> Add User</p>
                </a>

                <ul>
                    {
                        users.map((user, i) =>
                        <Card key={i} title={user.username} style={{ width: 300, margin: '20px', float: 'left' }}
                            extra={
                                <div>
                                    <a onClick={this.handlesEditGroupClick.bind(this, user)}>
                                        <Icon style={{ fontSize: '20px' }} type='edit'/>
                                    </a>
                                    <a onClick={this.handlesGroupClick.bind(this, user)}>
                                        <Icon style={{ fontSize: '20px', marginLeft: 15 }} type='select'/>
                                    </a>
                                </div>
                            }>
                            <div style={{flexDirection: 'row'}}><p>{user.email}</p></div>
                            <div style={{flexDirection: 'row'}}><p>{user.firstName} {user.lastName}</p></div>
                            <div style={{flexDirection: 'row'}}><p>{user.role}</p></div>
                        </Card>)
                    }
                </ul>
            </div>
        )
    }

    handlesCreateGroupClick = event => {
        const { router } = this.context
        router.push({ pathname: '/users/create' })
    }

    handlesEditGroupClick = (user, event) => {
        const { router } = this.context
        router.push({ pathname: '/users/edit/' + user._id })
    }

    handlesGroupClick = (user, event) => {
        const { router } = this.context
        router.push({ pathname: '/user/' + user._id })
    }
}

Users.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterUsers: PropTypes.func.isRequired,
    leaveUsers: PropTypes.func.isRequired
}

Users.contextTypes = {
    router: PropTypes.object
}

export default Users
