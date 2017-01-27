
import cx from 'classnames'
import { Card, Icon } from 'antd'
import { Loader } from '../../components'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

class Groups extends Component {

    state = {
        animated: true,
        viewEntersAnim: true
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
                        groups.map((group, i) =>
                        <Card key={i} title={group.name} style={{ width: 300, margin: '20px', float: 'left' }}
                            extra={
                                <div>
                                    <a onClick={this.handlesEditGroupClick.bind(this, group)}>
                                        <Icon style={{ fontSize: '20px' }} type='edit'/>
                                    </a>
                                    <a onClick={this.handlesGroupClick.bind(this, group)}>
                                        <Icon style={{ fontSize: '20px', marginLeft: 15 }} type='select'/>
                                    </a>
                                </div>
                            }>
                            <p>{group.description}</p>
                        </Card>)
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
        router.push({ pathname: '/group/' + group._id })
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
