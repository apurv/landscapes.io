
import cx from 'classnames'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Form, Select, Input, Switch, Radio, Slider, Button, Upload, Icon, Row, message } from 'antd'

import { Loader } from '../../components'

const FormItem = Form.Item
const Dragger = Upload.Dragger

class CreateGroup extends Component {

    state = {
        animated: true,
        viewEntersAnim: true
    }

    componentDidMount() {
        const { enterGroups, groups, params } = this.props

        let currentGroup = groups.find(ls => { return ls._id === params.id })

        let test = {}

        for (let key in currentGroup) {
            test[key] = {
                value: currentGroup[key],
                errors: [new Error('forbid ha')]
            }
        }

        this.props.form.setFields(test)

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

        let self = this
        const { animated, viewEntersAnim } = this.state
        const { loading, groups, params } = this.props
        const { setFieldsValue, getFieldDecorator } = this.props.form

        let currentGroup = groups.find(ls => { return ls._id === params.id })
        console.log('%c currentGroup ', 'background: #1c1c1c; color: rgb(209, 29, 238)', currentGroup)


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
              <h5>Create Group</h5><br/><br/>
              <Row type='flex' className={cx({ 'screen-height': true, 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                  <Form style={{ width: '100%' }} onSubmit={this.handleSubmit}>
                      <FormItem
                          {...formItemLayout}
                          label='Name'
                      >
                          {getFieldDecorator('name', {
                              rules: [{ required: true, message: 'Please input name of the group' }],
                          })(
                              <Input placeholder='Group Name' />
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
                          label='Permissions'
                      >

                        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                          <Checkbox
                            indeterminate={this.state.indeterminate}
                            onChange={this.onCheckAllChange}
                            checked={this.state.checkAll}
                          >
                            Check all
                          </Checkbox>
                        </div>
                        <br />
                        <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onCheckedChange} />
                        </FormItem>

                      <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                          <Button type='primary' htmlType='submit' disabled={loading} onClick={this.handlesCreateClick}>
                              Confirm Edit
                          </Button>
                      </FormItem>
                  </Form>
              </Row>
          </div>
        )
    }

    handlesGroupClick = event => {
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

        let groupToCreate = this.props.form.getFieldsValue()
        groupToCreate.imageUri = this.state.imageUri || ''
        groupToCreate.cloudFormationTemplate = this.state.cloudFormationTemplate || ''

        this.props.mutate({
            variables: { group: groupToCreate }
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

CreateGroup.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterGroups: PropTypes.func.isRequired,
    leaveGroups: PropTypes.func.isRequired
}

CreateGroup.contextTypes = {
    router: PropTypes.object
}

export default Form.create()(CreateGroup)
