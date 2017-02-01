import cx from 'classnames'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Row, Col } from 'react-flexbox-grid'
import { Card, CardHeader, CardText, MenuItem, RaisedButton, SelectField, TextField, Toggle } from 'material-ui'

import './accounts.style.scss'
import { Loader } from '../../components'

class UpdateAccount extends Component {

    state = {
        animated: true,
        viewEntersAnim: true,
        loading: false
    }

    componentDidMount() {
        const { enterLandscapes, accounts, params } = this.props
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
        const { loading, accounts, params } = this.props
        const currentAccount = accounts.find(ac => { return ac._id === params.id })

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

        if (loading || this.state.loading) {
            return (
                <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Loader/>
                </div>
            )
        }

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                <Row center='xs' middle='xs'>
                    <Col xs={6} lg={9} className={cx( { 'create-account': true } )}>
                        <Row middle='xs'>
                            <Col xs={4} style={{ textAlign: 'left' }}>
                                <h4>Edit Account</h4>
                            </Col>
                            <Col xs={8}>
                                <RaisedButton label='Save' onClick={this.handlesCreateClick}
                                    style={{ float: 'right', margin: '30px 0px' }}
                                    labelStyle={{ fontSize: '11px' }}/>
                            </Col>
                        </Row>
                        <Card>

                            <TextField id='name' ref='name' defaultValue={currentAccount.name} floatingLabelText='Name' className={cx( { 'two-field-row': true } )}/>

                            <SelectField id='region' floatingLabelText='Region' value={this.state.region || currentAccount.region} onChange={this.handlesRegionChange}
                                floatingLabelStyle={{ left: '0px' }} className={cx( { 'two-field-row': true } )}>
                                {
                                    menuItems.map((item, index) => {
                                        return (
                                            <MenuItem key={index} value={item.value} primaryText={item.text}/>
                                        )
                                    })
                                }
                            </SelectField>

                            <TextField id='accessKeyId' ref='accessKeyId' defaultValue={currentAccount.accessKeyId} floatingLabelText='Access Key ID' fullWidth={true}/>

                            <TextField id='secretAccessKey' ref='secretAccessKey' defaultValue={currentAccount.secretAccessKey} multiLine={true} rows={4} floatingLabelText='Secret Access Key' fullWidth={true}
                                floatingLabelStyle={{ left: '0px' }}/>

                            <CardHeader title='Advanced' titleStyle={{ fontSize: '13px', paddingRight: 0 }} actAsExpander={true} showExpandableButton={true}/>

                            <CardText expandable={true}>
                                <TextField id='endpoint' ref='endpoint' defaultValue={currentAccount.endpoint} floatingLabelText='Endpoint' fullWidth={true}/>

                                <TextField id='caBundlePath' ref='caBundlePath' defaultValue={currentAccount.caBundlePath} floatingLabelText='CA Bundle' fullWidth={true}/>

                                <Toggle id='rejectUnauthorizedSsl' ref='rejectUnauthorizedSsl' defaultToggled={currentAccount.rejectUnauthorizedSsl} label='Reject Unauthorized SSL'
                                    style={{ marginTop: '25px' }} labelStyle={{ width: 'none' }}/>

                                <TextField id='signatureBlock' ref='signatureBlock' defaultValue={currentAccount.signatureBlock} multiLine={true} rows={4} fullWidth={true}
                                    floatingLabelText='Signature Block' floatingLabelStyle={{ left: '0px' }}/>
                            </CardText>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

    handlesRegionChange = (event, index, value) => {
        this.setState({
            region: value
        })
    }

    handlesUpdateClick = event => {
        event.preventDefault()
        const { mutate, params } = this.props
        const { router } = this.context
        this.setState({loading: true})

        let accountToUpdate = {}

        // map all fields to accountToUpdate
        for (let key in this.refs) {
            if (key === 'rejectUnauthorizedSsl') {
                accountToUpdate[key] = this.refs[key].isToggled()
            } else {
                accountToUpdate[key] = this.refs[key].getValue()
            }
        }

        // attach derived fields
        accountToUpdate._id = params.id
        accountToUpdate.region = this.state.region

        mutate({
            variables: { account: accountToUpdate }
         }).then(({ data }) => {
           console.log('account updated', data)
           this.props.refetchAccounts({}).then(({ data }) =>{
             console.log('got data', data);
             this.setState({
               successOpen: true,
               loading: false
             })
             router.push({ pathname: '/accounts' })
           }).catch((error) => {
             this.setState({loading: false})
               console.log('there was an error sending the SECOND query', error)
           })
        }).catch(error => {
            console.log('there was an error sending the query', error)
        })
    }
}

UpdateAccount.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterLandscapes: PropTypes.func.isRequired,
    leaveLandscapes: PropTypes.func.isRequired,
    refetchAccounts: PropTypes.func
}

UpdateAccount.contextTypes = {
    router: PropTypes.object
}

export default UpdateAccount