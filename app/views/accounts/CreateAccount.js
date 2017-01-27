
import cx from 'classnames'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Form, Select, Switch, Collapse, Input, Button, Icon, Row, message } from 'antd'

import './accounts.style.scss'
import { Loader } from '../../components'

const FormItem = Form.Item
const Panel = Collapse.Panel

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
        const { getFieldsValue, getFieldDecorator } = this.props.form

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 }
        }

        const menuItems = [
            { name: 'Gov Cloud', value: 'us-gov-west-1' },
            { name: 'US East (Northern Virginia) Region', value: 'us-east-1' },
            { name: 'US West (Northern California) Region', value: 'us-west-1' },
            { name: 'US West (Oregon) Region', value: 'us-west-2' },
            { name: 'EU (Ireland) Region', value: 'eu-west-1' },
            { name: 'Asia Pacific (Singapore) Region', value: 'ap-southeast-1' },
            { name: 'Asia Pacific (Sydney) Region', value: 'ap-southeast-2' },
            { name: 'Asia Pacific (Tokyo) Region', value: 'ap-northeast-1' },
            { name: 'South America (Sao Paulo) Region', value: 'sa-east-1' }
        ]

        if (loading) {
            return (
                <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Loader/>
                </div>
            )
        }

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                <h5>Create Account</h5><br/><br/>
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
                            {getFieldDecorator('region', {
                                rules: [{ required: true, message: 'Please select a region' }],
                            })(
                                <Select placeholder='Select a default region' disabled={getFieldsValue().isOtherRegion}>
                                    {
                                        menuItems.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.value}>{item.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='Other Region?'>
                            {
                                getFieldsValue().isOtherRegion
                                ?
                                    getFieldDecorator('region', {})(
                                        <div>
                                            <Switch defaultChecked={getFieldsValue().isOtherRegion} onChange={this.handlesOtherRegionClick} />
                                            <Input placeholder='Enter Region'/>
                                        </div>
                                    )
                                :
                                    getFieldDecorator('isOtherRegion', {})(
                                        <Switch defaultChecked={false} onChange={this.handlesOtherRegionClick} />
                                    )
                            }
                        </FormItem>

                        <FormItem {...formItemLayout} label='Access Key ID'>
                            {getFieldDecorator('accessKeyId', {
                                rules: [{ required: true, message: 'Please input the access key ID' }],
                            })(
                                <Input placeholder='Access Key ID'/>
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='Secret Access Key'>
                            {getFieldDecorator('secretAccessKey', {})(
                                <Input type='textarea' rows={4} placeholder='Secret Access Key' />
                            )}
                        </FormItem>

                        <Collapse bordered={false} defaultActiveKey={['0']}>
                            <Panel header='Advanced' key='1' icon={<Icon type="down-circle-o" />}>
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

                                <FormItem {...formItemLayout} label='SSL'>
                                    {getFieldDecorator('rejectUnauthorizedSsl', {})(
                                        <Switch defaultChecked={false} />
                                    )}
                                </FormItem>

                                <FormItem {...formItemLayout} label='Signature Block'>
                                    {getFieldDecorator('signatureBlock', {})(
                                        <Input type='textarea' rows={4} placeholder='Signature Block' />
                                    )}
                                </FormItem>
                            </Panel>
                        </Collapse>

                        <FormItem wrapperCol={{ span: 12, offset: 12 }}>
                            <Button type='primary' id='create-button' htmlType='submit' disabled={loading} onClick={this.handlesCreateClick}>
                                Create
                            </Button>
                        </FormItem>
                    </Form>
                </Row>
            </div>
        )
    }

    handlesOtherRegionClick = event => {
        const { setFieldsValue, getFieldsValue } = this.props.form
        setFieldsValue({ region: getFieldsValue().region })
        console.log('%c getFieldsValue ', 'background: #1c1c1c; color: rgb(209, 29, 238)', getFieldsValue())
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

        const { mutate } = this.props
        const { getFieldsValue } = this.props.form
        let accountToCreate = getFieldsValue()

        event.preventDefault()

        mutate({
            variables: { account: accountToCreate }
         }).then(({ data }) => {
            console.log('created', data)
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
