import cx from 'classnames'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Row, Col } from 'react-flexbox-grid'
import { Card, CardHeader, CardText, MenuItem, RaisedButton, SelectField, TextField, Toggle } from 'material-ui'

import './deployments.style.scss'
import { Loader } from '../../components'

class CreateDeployment extends Component {

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

        const { animated, viewEntersAnim } = this.state
        const { loading, accounts } = this.props

        console.log('%c this.props ', 'background: #1c1c1c; color: deeppink', this.props)

        const menuItems = [
            { text: 'Gov Cloud', value: 'us-gov-west-1' },
            { text: 'US East (Northern Virginia) Region', value: 'us-east-1' },
            { text: 'US West (Northern California) Region', value: 'us-west-1' },
            { text: 'US West (Oregon) Region', value: 'us-west-2' },
            { text: 'EU (Ireland) Region', value: 'eu-west-1' },
            { text: 'Asia Pacific (Singapore) Region', value: 'ap-southeast-1' },
            { text: 'Asia Pacific (Sydney) Region', value: 'ap-southeast-2' },
            { text: 'Asia Pacific (Tokyo) Region', value: 'ap-northeast-1' },
            { text: 'South America (Sao Paulo) Region', value: 'sa-east-1' }
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
                <h5>Deploy</h5>

                <Row center='xs' middle='xs'>
                    <Col xs={6} lg={9} className={cx( { 'create-deployment': true } )}>
                        <Card>
                            <TextField id='stackName' ref='stackName' floatingLabelText='Stack Name' className={cx( { 'two-field-row': true } )}/>

                            <SelectField id='accountName' floatingLabelText='Account Name' value={this.state.accountName} onChange={this.handlesAccountChange}
                                floatingLabelStyle={{ left: '0px' }} className={cx( { 'two-field-row': true } )}>
                                {
                                    accounts.map((acc, index) => {
                                        return (
                                            <MenuItem key={index} value={acc.name} primaryText={acc.name}/>
                                        )
                                    })
                                }
                            </SelectField>

                            <TextField id='description' ref='description' floatingLabelText='Description' fullWidth={true}/>

                            <SelectField id='location' floatingLabelText='Region' value={this.state.location} onChange={this.handlesRegionChange}
                                floatingLabelStyle={{ left: '0px' }} className={cx( { 'two-field-row': true } )}>
                                {
                                    menuItems.map((item, index) => {
                                        return (
                                            <MenuItem key={index} value={item.value} primaryText={item.text}/>
                                        )
                                    })
                                }
                            </SelectField>

                            <TextField id='billingCode' ref='billingCode' floatingLabelText='Billing Code' fullWidth={true}
                                className={cx( { 'two-field-row': true } )}/>

                            <TextField id='accessKeyId' ref='accessKeyId' value={this.state.accessKeyId} floatingLabelText='Access Key ID' fullWidth={true}/>

                            <TextField id='secretAccessKey' ref='secretAccessKey' value={this.state.secretAccessKey} multiLine={true} rows={4} floatingLabelText='Secret Access Key' fullWidth={true}
                                floatingLabelStyle={{ left: '0px' }}/>

                            <CardHeader title='Advanced' titleStyle={{ fontSize: '13px', paddingRight: 0 }} actAsExpander={true} showExpandableButton={true}/>

                            <CardText expandable={true}>
                                <TextField id='endpoint' ref='endpoint' value={this.state.endpoint} floatingLabelText='Endpoint' fullWidth={true}/>

                                <TextField id='caBundlePath' ref='caBundlePath' value={this.state.caBundlePath} floatingLabelText='CA Bundle' fullWidth={true}/>

                                <Toggle id='rejectUnauthorizedSsl' ref='rejectUnauthorizedSsl' defaultToggled={this.state.rejectUnauthorizedSsl} label='Reject Unauthorized SSL'
                                    style={{ marginTop: '25px' }} labelStyle={{ width: 'none' }}/>

                                <TextField id='signatureBlock' ref='signatureBlock' value={this.state.signatureBlock} multiLine={true} rows={4} fullWidth={true}
                                    floatingLabelText='Signature Block' floatingLabelStyle={{ left: '0px' }}/>
                            </CardText>
                        </Card>

                        <Row>
                            <Col xs={6}>
                                <Card>
                                    <CardHeader title='Tags'/>
                                    {/* TODO: add tags capability */}
                                    <CardText>
                                    </CardText>
                                </Card>
                            </Col>
                            <Col xs={6}>
                                <Card>
                                    <CardHeader title='Parameters'/>
                                    <CardText></CardText>
                                </Card>
                            </Col>
                        </Row>

                        <RaisedButton label='Deploy' onClick={this.handlesDeployClick}
                            style={{ margin: 50, float: 'left' }}
                            labelStyle={{ textTransform: 'none' }}/>
                    </Col>
                </Row>
            </div>
        )
    }

    handlesAccountChange = (event, index, accountName) => {
        const { accounts } = this.props
        const account = accounts.find(acc => { return acc.name === accountName })

        this.setState({
            accountName: accountName,
            accessKeyId: account.accessKeyId || '',
            secretAccessKey: account.secretAccessKey || '',
            endpoint: account.endpoint || '',
            caBundlePath: account.caBundlePath || '',
            rejectUnauthorizedSsl: account.rejectUnauthorizedSsl || '',
            signatureBlock: account.signatureBlock || ''
        })
    }

    handlesRegionChange = (event, index, value) => {
        this.setState({
            location: value
        })
    }

    handlesDeployClick = event => {

        event.preventDefault()
        const { mutate, params } = this.props
        const { router } = this.context

        let deploymentToCreate = {}

        // map all fields to deploymentToCreate
        for (let key in this.refs) {
            if (key === 'rejectUnauthorizedSsl') {
                deploymentToCreate[key] = this.refs[key].isToggled()
            } else {
                deploymentToCreate[key] = this.refs[key].getValue()
            }
        }

        // attach derived fields
        deploymentToCreate.location = this.state.location
        deploymentToCreate.accountName = this.state.accountName
        deploymentToCreate.landscapeId = params.landscapeId

        console.log('%c deploymentToCreate ', 'background: #1c1c1c; color: limegreen', deploymentToCreate)

        mutate({
            variables: { deployment: deploymentToCreate }
         }).then(({ data }) => {
            console.log('deployment created', data)
            router.push({ pathname: '/accounts' })
        }).catch(error => {
            console.log('there was an error sending the query', error)
        })
    }
}

CreateDeployment.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterLandscapes: PropTypes.func.isRequired,
    leaveLandscapes: PropTypes.func.isRequired
}

CreateDeployment.contextTypes = {
    router: PropTypes.object
}

export default CreateDeployment
