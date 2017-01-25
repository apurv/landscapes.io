import cx from 'classnames'
import axios from 'axios'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Form, Icon, Input, Button, Checkbox, Row } from 'antd'
import './login.style.scss'
const FormItem = Form.Item

import { ErrorAlert } from '../../components'

class Login extends Component {

    state = {
        animated: true,
        viewEntersAnim: true,

        username: '',
        password: ''
    }

    componentDidMount() {
        const { enterLogin } = this.props
        enterLogin()
    }

    // componentWillReceiveProps(newProps) {
    //   const { user: { username } } = newProps
    //
    //   if (username &&
    //       username.length > 0 &&
    //       this.props.user.username !== username) {
    //     this.setState({username: username})
    //   }
    // }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
        const { leaveLogin } = this.props
        leaveLogin()
    }

    render() {
        const { animated, viewEntersAnim } = this.state
        const { loading } = this.props
        const { getFieldDecorator } = this.props.form

        return (
            <Row type='flex' justify='center' align='middle' className={cx({ 'screen-height': true, 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                <Form onSubmit={this.handleSubmit} className='login-form'>
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input addonBefore={<Icon type='user' />} placeholder='Username' />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input addonBefore={<Icon type='lock' />} type='password' placeholder='Password' />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>Remember me</Checkbox>
                        )}
                        <Button type='primary' htmlType='submit' className='login-form-button' disabled={loading} onClick={this.handlesOnLogin}>
                            Log in
                        </Button>
                    </FormItem>
                </Form>
            </Row>
        )
    }

    handlesOnEmailChange = event => {
        event.preventDefault()
        // should add some validator before setState in real use cases
        this.setState({ username: event.target.value })
    }

    handlesOnPasswordChange = event => {
        event.preventDefault()
        // should add some validator before setState in real use cases
        this.setState({ password: event.target.value })
    }

    handlesOnLogin = event => {
        event.preventDefault()
        const { loginUser } = this.props
        const { username, password } = this.props.form.getFieldsValue()
        const { router } = this.context

        axios({
            method: 'post',
            url: 'http://0.0.0.0:8080/api/auth/signin',
            data: {
                username: username,
                password: password
            }
        }).then(res => {
            loginUser(res.data)
            console.log('res data', res.data)
            // this.props.user = res.data
            router.push({ pathname: '/landscapes' })
        })
    }

    closeError = (event) => {
        event.preventDefault()
        const { resetError } = this.props
        resetError()
    }
}

Login.propTypes = {
    // views props:
    currentView: PropTypes.string.isRequired,
    enterLogin: PropTypes.func.isRequired,
    leaveLogin: PropTypes.func.isRequired,
    // apollo props:
    user: PropTypes.shape({username: PropTypes.string}),

    // auth props:
    userIsAuthenticated: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,

    // apollo actions
    loginUser: PropTypes.func.isRequired,

    // redux actions
    onUserLoggedIn: PropTypes.func.isRequired,
    resetError: PropTypes.func.isRequired
}

Login.contextTypes = {
    router: PropTypes.object
}

export default Form.create()(Login)
