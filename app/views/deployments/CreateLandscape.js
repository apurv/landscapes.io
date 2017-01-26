
import cx from 'classnames'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Form, Select, Input, Switch, Radio, Slider, Button, Upload, Icon, Row } from 'antd'

import { Loader } from '../../components'

const FormItem = Form.Item
const Dragger = Upload.Dragger

class CreateLandscape extends Component {

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
        console.log('%c this.props ', 'background: #1c1c1c; color: rgb(209, 29, 238)', this.props)
        const { animated, viewEntersAnim } = this.state
        const { loading, landscapes } = this.props
        const { getFieldDecorator } = this.props.form

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 }
        }

        const dragProps = {
            name: 'file',
            multiple: true,
            showUploadList: false,
            action: '/upload.do',
            onChange(info) {
                const status = info.file.status;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
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
                <h5>Create Landscape</h5><br/><br/>
                <Row type='flex' className={cx({ 'screen-height': true, 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Form style={{ width: '100%' }} onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label='Name'
                        >
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: 'Please input name of the landscape' }],
                            })(
                                <Input placeholder='Name' />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label='Version'
                        >
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: 'Please input version of the landscape' }],
                            })(
                                <Input placeholder='1.0' />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label='Description'
                        >
                            {getFieldDecorator('name', {})(
                                <Input type="textarea" rows={4} placeholder='Description' />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label='Info Link'
                        >
                            {getFieldDecorator('name', {})(
                                <Input placeholder='Info Link' />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label='Link Test'
                        >
                            {getFieldDecorator('name', {})(
                                <Input placeholder='Link Test' />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label='CloudFormation Template'
                        >
                            {getFieldDecorator('name', {})(
                                <div style={{ marginTop: 16, height: 180 }}>
                                    <Dragger {...dragProps}>
                                        <p className="ant-upload-drag-icon">
                                            <Icon type="inbox" />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">Support for a single files only</p>
                                    </Dragger>
                                </div>
                            )}
                        </FormItem>

                        <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                            <Button type="primary" htmlType="submit">Submit</Button>
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
            router.push({ pathname: '/landscapes' })
        })
    }

    closeError = (event) => {
        event.preventDefault()
        const { resetError } = this.props
        resetError()
    }
}

CreateLandscape.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterLandscapes: PropTypes.func.isRequired,
    leaveLandscapes: PropTypes.func.isRequired
}

CreateLandscape.contextTypes = {
    router: PropTypes.object
}

export default Form.create()(CreateLandscape)
