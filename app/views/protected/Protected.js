import cx from 'classnames'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Form, Icon, Input, Button, Checkbox, Row } from 'antd'
import { Link } from 'react-router'


class Protected extends Component {

    state = {
        animated: true,
        viewEntersAnim: true
    }

    componentDidMount() {
        const { enterProtected } = this.props
        enterProtected()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
        const { leaveProtected } = this.props
        leaveProtected()
    }

    render() {
        const { animated, viewEntersAnim } = this.state

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                <h1 className='text-danger'>
                    Here is a protected view!
                </h1>
                <h2 className='text-danger'>
                    "You've just logged in to be able to enter this view."
                </h2>
                <Link to={'/changePassword'}>
                    <Button type="primary">Change Password</Button>
                </Link>
            </div>
        )
    }
}

Protected.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterProtected: PropTypes.func.isRequired,
    leaveProtected: PropTypes.func.isRequired
}

export default Protected
