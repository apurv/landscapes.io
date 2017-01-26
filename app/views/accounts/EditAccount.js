
import cx from 'classnames'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Form, Select, Input, Switch, Radio, Slider, Button, Upload, Icon, Row, message } from 'antd'

import { Loader } from '../../components'

const FormItem = Form.Item
const Dragger = Upload.Dragger

class EditLandscape extends Component {

    state = {
        animated: true,
        viewEntersAnim: true
    }

    componentDidMount() {
        const { enterLandscapes, landscapes, params } = this.props

        let currentLandscape = landscapes.find(ls => { return ls._id === params.id })

        let test = {}

        for (let key in currentLandscape) {
            test[key] = {
                value: currentLandscape[key],
                errors: []
            }
        }

        this.props.form.setFields(test)

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
        const { loading, landscapes, params } = this.props
        const { setFieldsValue, getFieldDecorator } = this.props.form

        let currentLandscape = landscapes.find(ls => { return ls._id === params.id })
        console.log('%c currentLandscape ', 'background: #1c1c1c; color: rgb(209, 29, 238)', currentLandscape)


        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 }
        }

        const uploadProps = {
            action: 'http://localhost:8080/api/upload/template',
            listType: 'picture',
            defaultFileList: [{
                uid: -1,
                name: 'default.png',
                status: 'done',
                url: 'http://icons.iconarchive.com/icons/uiconstock/socialmedia/512/AWS-icon.png',
                thumbUrl: 'http://icons.iconarchive.com/icons/uiconstock/socialmedia/512/AWS-icon.png'
            }]
        }

        const dragProps = {
            name: 'file',
            multiple: false,
            showUploadList: false,
            action: 'http://localhost:8080/api/upload/template',
            onChange(info) {
                const status = info.file.status

                if (status !== 'uploading') {
                    console.log(info.file, info.fileList)
                }
                if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`)
                    self.setState({
                        cloudFormationTemplate: JSON.stringify(info.file.response, null, 4)
                    })
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`)
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
                <h5>Edit Landscape</h5><br/><br/>
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
                            {getFieldDecorator('version', {
                                rules: [{ required: true, message: 'Please input version of the landscape' }],
                            })(
                                <Input placeholder='1.0' />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label='Description'
                        >
                            {getFieldDecorator('description', {})(
                                <Input type="textarea" rows={4} placeholder='Description' />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label='Info Link'
                        >
                            {getFieldDecorator('infoLink', {})(
                                <Input placeholder='Info Link' />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label='Link Test'
                        >
                            {getFieldDecorator('infoLinkText', {})(
                                <Input placeholder='Link Test' />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label='Avatar'
                        >
                            {getFieldDecorator('imageUri', {})(
                                <Upload {...uploadProps}>
                                    <Button type="ghost">
                                        <Icon type="upload" /> Upload
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>

                        {
                            this.state.cloudFormationTemplate
                            ?
                                <textarea rows={100} style={{ background: '#f9f9f9', fontFamily: 'monospace', width: '100%' }}>{ this.state.cloudFormationTemplate }</textarea>
                            :
                                <FormItem
                                    {...formItemLayout}
                                    label='CloudFormation Template'
                                >
                                    {getFieldDecorator('cloudFormationTemplate', {})(
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
                        }


                        <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                            <Button type='primary' htmlType='submit' disabled={loading} onClick={this.handlesSaveClick}>
                                Save
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

    handlesSaveClick = event => {

        event.preventDefault()

        let landscapeToSave = this.props.form.getFieldsValue()
        landscapeToSave.imageUri = this.state.imageUri || ''
        landscapeToSave.cloudFormationTemplate = this.state.cloudFormationTemplate || ''

        this.props.mutate({
            variables: { landscape: landscapeToSave }
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

EditLandscape.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterLandscapes: PropTypes.func.isRequired,
    leaveLandscapes: PropTypes.func.isRequired
}

EditLandscape.contextTypes = {
    router: PropTypes.object
}

export default Form.create()(EditLandscape)
