import cx from 'classnames'
import { Form, Select, Input, Switch, Radio, Slider, Button, Upload, Icon, Row, message } from 'antd'
import { Loader } from '../../components'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'


const FormItem = Form.Item

class CreateUser extends Component {

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

            let self = this
            const { animated, viewEntersAnim } = this.state
            const { loading, users } = this.props

            const formItemLayout = {
                labelCol: { span: 8 },
                wrapperCol: { span: 12 }
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
                    <h5>Create User</h5><br/><br/>
                    <Row type='flex' className={cx({ 'screen-height': true, 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                        <Form style={{ width: '100%' }} onSubmit={this.handleSubmit}>
                            <FormItem
                                {...formItemLayout}
                                label='Username'
                            >
                                    <Input placeholder='Username' />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label='Email'
                            >
                                    <Input placeholder='user@email.com' />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label='firstName'
                            >
                                    <Input placeholder='First Name' />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label='lastName'
                            >
                                    <Input placeholder='Last Name' />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label='New Password'

                            >
                                    <Input type="password" placeholder='New Password' />
                            </FormItem>



                            <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                                <Button type='primary' htmlType='submit' disabled={loading} onClick={this.handlesCreateClick}>
                                    Create
                                </Button>
                            </FormItem>
                        </Form>
                    </Row>
                </div>
            )
        }

        handlesUserClick = event => {
            const { router } = this.context
            router.push({ pathname: '/protected' })
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

        handlesCreateClick = event => {

            event.preventDefault()

            let userToCreate = this.props.form.getFieldsValue()
            userToCreate.imageUri = this.state.imageUri || ''
            userToCreate.cloudFormationTemplate = this.state.cloudFormationTemplate || ''

            this.props.mutate({
                variables: { user: userToCreate }
             }).then(({ data }) => {
                console.log('got data', data)
            }).catch((error) => {
                console.log('there was an error sending the query', error)
            })

        }

        closeError = (event) => {
            event.preventDefault()
            const { resetError } = this.props
            resetError()
        }
    }

CreateUser.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterUsers: PropTypes.func.isRequired,
    leaveUsers: PropTypes.func.isRequired
}

CreateUser.contextTypes = {
    router: PropTypes.object
}

export default CreateUser