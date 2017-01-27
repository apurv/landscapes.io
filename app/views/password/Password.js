import cx from 'classnames'
import axios from 'axios'
import { Form, Icon, Input, Button, Checkbox, Row, message } from 'antd'
import { Link } from 'react-router'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
const FormItem = Form.Item
import { Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import { auth } from '../../services/auth'


class Password extends Component {
    state = {
        animated: true,
        viewEntersAnim: true,

        newPassword: '',
        verifyPassword: ''
    }

    componentDidMount() {
      console.log('THIS PROPS ----->', this.props)
        const { enterPasswordChange } = this.props
        enterPasswordChange()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
        const { leavePasswordChange } = this.props
        leavePasswordChange()
    }

    render() {
        const form = {}
        const { animated, viewEntersAnim } = this.state
        const { loading } = this.props

        return (
            // <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
            <div>
                <h1 className='text-danger'>
                    Change Password
                </h1>
                <Row type='flex' justify='center' align='top' className={cx({ 'screen-height': true, 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Form onSubmit={this.handleSubmit} className='login-form'>
                        <FormItem>
                            <Input onChange={this.handlesOldPasswordChange} addonBefore="Old Password" id="oldPassword" type='password' placeholder='Old Password' />
                        </FormItem>
                        <FormItem>
                            <Input onChange={this.handlesOnNewPasswordChange} addonBefore="New Password" id="newPassword" type='password' placeholder='New Password' />
                        </FormItem>
                        <FormItem>
                            <Input onChange={this.handlesOnVerifyPasswordChange} addonBefore="Verify Password" id="verifyPassword"  type='password' placeholder='Verify Password' />
                        </FormItem>
                        <FormItem>
                            <Button type='primary' htmlType='submit' className='login-form-button' disabled={loading} onClick={this.handlesOnPasswordChange}>
                                Change Password
                            </Button>
                        </FormItem>
                    </Form>

                </Row>
            </div>
        )
    }

    handlesOldPasswordChange = event => {
        event.preventDefault()
        console.log('oldPassword changed', event.target.value)
        // should add some validator before setState in real use cases
        this.setState({ currentPassword: event.target.value })
    }

    handlesOnNewPasswordChange = event => {
        event.preventDefault()
        console.log('newPassword changed', event.target.value)
        // should add some validator before setState in real use cases
        this.setState({ newPassword: event.target.value })
    }

    handlesOnVerifyPasswordChange = event => {
        event.preventDefault()
        console.log('verifyPassword changed', event.target.value)
        // should add some validator before setState in real use cases
        this.setState({ verifyPassword: event.target.value })
    }

    handlesOnPasswordChange = event => {
        event.preventDefault()
        const { loginUser } = this.props
        const { currentPassword, newPassword, verifyPassword } = this.state
        const { router } = this.context
        const user = auth.getUserInfo()
            ? auth.getUserInfo()
            : null

        console.log('user ', user)

        axios({
            method: 'post',
            url: 'http://0.0.0.0:8080/api/users/password',
            data: {
                passwordDetails:{
                  currentPassword: currentPassword,
                  newPassword: newPassword,
                  verifyPassword: verifyPassword
                },
                user: user
            },

        }).then(res => {
            console.log('res --->', res)
            message.config({
              top: 5,
              duration: 5,
            });

            message.success('Your password has been successfully changed.');
            this.setState({ oldPassword: '' })
            this.setState({ newPassword: '' })
            this.setState({ verifyPassword: '' })
            // router.push({ pathname: '/landscapes' })
        }).catch(err => {
            message.error('Password Change Fail.  Please Try Again.');
            console.log('ERROR: ', err )
        })
    }
}


Password.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterPasswordChange: PropTypes.func.isRequired,
    leavePasswordChange: PropTypes.func.isRequired
}
Password.contextTypes = {
    router: PropTypes.object
}


export default Password
