
import cx from 'classnames'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Form, Menu, Dropdown, Input, Switch, Button, Icon, Row, message } from 'antd'

import { Loader } from '../../components'

const FormItem = Form.Item

class CreateAccount extends Component {

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

        let self = this
        const { animated, viewEntersAnim } = this.state
        const { loading, accounts } = this.props
        const { getFieldDecorator } = this.props.form

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 }
        }

        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <a href="http://www.google.com/">1st menu item</a>
                </Menu.Item>
                <Menu.Item key="1">
                    <a href="http://www.google.com/">2nd menu item</a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">3d menu item</Menu.Item>
            </Menu>
        )

        if (loading) {
            return (
                <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Loader/>
                </div>
            )
        }

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                <h5>Create Landscape</h5><br/><br/>
                <Row type='flex' className={cx({ 'screen-height': true, 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Form style={{ width: '100%' }} onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout} label='Name'>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: 'Please input name of the account' }],
                            })(
                                <Input placeholder='Name' />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='Default Region'>
                            {getFieldDecorator('version', {
                                rules: [{ required: true, message: 'Please input version of the landscape' }],
                            })(
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <a className="ant-dropdown-link" href="#">
                                        Click me <Icon type="down" />
                                    </a>
                                </Dropdown>
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='Access Key ID'>
                            {getFieldDecorator('accessKeyId', {
                                rules: [{ required: true, message: 'Please input the access key ID' }],
                            })(
                                <Input placeholder='Access Key ID' />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='Secret Access Key'>
                            {getFieldDecorator('secretAccessKey', {})(
                                <Input type="textarea" rows={4} placeholder='Secret Access Key' />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='Endpoint'>
                            {getFieldDecorator('endpoint', {})(
                                <Input placeholder='Endpoint' />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='CA Bundle'>
                            {getFieldDecorator('caBundlePath', {})(
                                <Input placeholder='CA Bundle' />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='Signature Block'>
                            {getFieldDecorator('signatureBlock', {})(
                                <Input type="textarea" rows={4} placeholder='Signature Block' />
                            )}
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

    handlesLandscapeClick = event => {
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

        let landscapeToCreate = this.props.form.getFieldsValue()
        landscapeToCreate.imageUri = this.state.imageUri || ''
        landscapeToCreate.cloudFormationTemplate = this.state.cloudFormationTemplate || ''

        this.props.mutate({
            variables: { landscape: landscapeToCreate }
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

CreateAccount.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterLandscapes: PropTypes.func.isRequired,
    leaveLandscapes: PropTypes.func.isRequired
}

CreateAccount.contextTypes = {
    router: PropTypes.object
}

export default Form.create()(CreateAccount)
