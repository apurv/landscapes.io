
import cx from 'classnames'
import { Loader } from '../../components'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Row, Col } from 'react-flexbox-grid'
import { IoEdit, IoAndroidClose, IoIosCloudUploadOutline } from 'react-icons/lib/io'
import { Card, CardHeader, CardText, Dialog, FlatButton, RaisedButton, Tab, Tabs, TextField } from 'material-ui'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

class LandscapeDetails extends Component {

    state = {
        animated: true,
        viewEntersAnim: true,
        showDialog: false,
        currentDeployments: []
    }

    componentWillMount() {
        let self = this
        const { deploymentsByLandscapeId, params } = this.props

        deploymentsByLandscapeId({
            variables: { landscapeId: params.id }
        }).then(({ data }) => {
            self.setState({
                currentDeployments: data.deploymentsByLandscapeId.filter(d => { return d.landscapeId === params.id })
            })
        })
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
        const { animated, viewEntersAnim, currentDeployment, currentDeployments, deleteType } = this.state
        const { loading, landscapes, deploymentsByLandscapeId, params } = this.props

        const currentLandscape = landscapes.find(ls => { return ls._id === params.id })
        const parsedCFTemplate = JSON.parse(currentLandscape.cloudFormationTemplate)

        let paramDetails = []

        function getDeploymentInfo(deployment) {

            let deploymentInfo = []

            for (let key in deployment) {
                switch (key) {
                    case 'location':
                        deploymentInfo.push({ key: 'Region', value: deployment.location })
                        break
                    case 'createdAt':
                        deploymentInfo.push({ key: 'Created At', value: deployment.createdAt })
                        break
                    case 'stackId':
                        deploymentInfo.push({ key: 'Stack ID', value: deployment.stackId })
                        break
                    default:
                        break
                }
            }

            return deploymentInfo.map((dep, i) => {
                return (
                    <Row key={i}>
                        <label style={{ margin: '0px 15px' }}>{dep.key}</label>
                        <label>{dep.value}</label>
                    </Row>
                )
            })
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
                <Row middle='xs'>
                    <Col xs={4} style={{ textAlign: 'left' }}>
                        <h4>Landscape Details - {currentLandscape.name}</h4>
                    </Col>
                    <Col xs={8}>
                        <RaisedButton label='Deploy' onClick={this.handlesDeployClick}
                            style={{ float: 'right', marginBottom: '30px' }}
                            labelStyle={{ fontSize: '11px' }} icon={<IoIosCloudUploadOutline/>}/>
                        <RaisedButton label='Edit' onClick={this.handlesEditLandscapeClick}
                            style={{ float: 'right', marginBottom: '30px' }}
                            labelStyle={{ fontSize: '11px' }} icon={<IoEdit/>}/>
                    </Col>
                </Row>
                <Tabs>
                    <Tab label='Deployments'>
                        <CardHeader style={{ background: '#e6e6e6' }}>
                            <Row between='xs'>
                                <Col xs={2}><label>Deployment Name</label></Col>
                                <Col xs={2}><label>Region</label></Col>
                                <Col xs={2}><label>Date Created</label></Col>
                                <Col xs={4}><label>Status</label></Col>
                                <Col xs={2}></Col>
                            </Row>
                            <Dialog title={deleteType + ' Deployment'} modal={false} open={this.state.showDialog}
                                titleStyle={{ textTransform: 'uppercase', fontSize: '16px', fontWeight: 'bold' }}
                                onRequestClose={this.handlesDialogToggle.bind(this, currentDeployment)}
                                actions={[
                                    <FlatButton label='Cancel' primary={true} onTouchTap={this.handlesDialogToggle.bind(this, currentDeployment)}/>,
                                    <FlatButton label={deleteType + ''} primary={true} onTouchTap={this.handlesDeleteDeploymentClick.bind(this, currentDeployment)}/>
                                ]}> Are you sure you want to {deleteType} {currentDeployment ? currentDeployment.stackName : ''}?
                            </Dialog>
                        </CardHeader>
                        {
                            currentDeployments.map((deployment, index) => {
                                return (
                                    <Card key={index}>
                                        <CardHeader actAsExpander={true} showExpandableButton={true}>
                                            <Row between='xs'>
                                                <Col xs={2}>{deployment.stackName}</Col>
                                                <Col xs={2}>{deployment.location}</Col>
                                                <Col xs={2}>{deployment.createdAt}</Col>
                                                <Col xs={4}></Col>
                                                <Col xs={2}>
                                                    <FlatButton label={deployment.isDeleted ? 'Purge' : 'Delete'} icon={<IoAndroidClose/>} labelStyle={{ fontSize: '11px' }}
                                                        onTouchTap={this.handlesDialogToggle.bind(this, deployment)}/>
                                                </Col>
                                            </Row>
                                        </CardHeader>
                                        <CardText key={index} expandable={true}>
                                            { getDeploymentInfo(deployment) }
                                        </CardText>
                                    </Card>
                                )
                            })
                        }
                    </Tab>

                    <Tab label='Template'>
                        <textarea rows={100} style={{ background: '#f9f9f9', fontFamily: 'monospace', width: '100%' }}>
                            { currentLandscape.cloudFormationTemplate }
                        </textarea>
                    </Tab>

                    <Tab label='Resources'>
                        <Table>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow>
                                    <TableHeaderColumn></TableHeaderColumn>
                                    <TableHeaderColumn>Resource</TableHeaderColumn>
                                    <TableHeaderColumn>Resource Type</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {
                                    Object.keys(parsedCFTemplate.Resources).map((res, index) => {
                                        return (
                                            <TableRow key={`${index}`}>
                                                <TableRowColumn>{index + 1}</TableRowColumn>
                                                <TableRowColumn>{res}</TableRowColumn>
                                                <TableRowColumn>{parsedCFTemplate.Resources[res].Type}</TableRowColumn>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </Tab>

                    <Tab label='Parameters'>
                        {
                            Object.keys(parsedCFTemplate.Parameters).map((key, index) => {
                                let _param = parsedCFTemplate.Parameters[key]

                                for (let k in _param) {

                                    if (!paramDetails[index]) {
                                        paramDetails[index] = []
                                    }

                                    paramDetails[index][k] = _param[k]
                                }

                                return (
                                    <Card key={index}>
                                        <CardHeader title={key} titleStyle={{ fontSize: '13px', paddingRight: 0 }} actAsExpander={true} showExpandableButton={true}/>

                                        {
                                            paramDetails.map((p, i) => {
                                                return (
                                                    <CardText key={i} expandable={true}>
                                                        <Row>
                                                            <label style={{ margin: '0px 15px' }}>{Object.keys(p)[i]}</label>
                                                            <label>{p.Description}</label>
                                                        </Row>
                                                    </CardText>
                                                )
                                            })
                                        }
                                    </Card>
                                )
                            })
                        }
                    </Tab>

                    <Tab label='Mappings'>

                    </Tab>
                </Tabs>
            </div>
        )
    }

    handlesDialogToggle = (deployment, event) => {
        this.setState({
            currentDeployment: deployment,
            showDialog: !this.state.showDialog,
            deleteType: deployment.isDeleted ? 'purge' : 'delete'
        })
    }

    handlesEditLandscapeClick = (deployment, event) => {
        const { params } = this.props
        const { router } = this.context
        router.push({ pathname: '/landscapes/edit/' + params.id })
    }

    handlesDeleteDeploymentClick = (deployment, event) => {
        event.preventDefault()

        const { mutate, params } = this.props
        const { router } = this.context

        this.handlesDialogToggle(deployment)

        mutate({
            variables: { deployment }
         }).then(({ data }) => {
            console.log('deleted', data)
            router.push({ pathname: `/landscape/${params.id}` })
        }).catch((error) => {
            console.log('there was an error sending the query', error)
        })
    }

    handlesDeployClick = event => {
        const { params } = this.props
        const { router } = this.context
        router.push({ pathname: `${params.id}/deployments/create` })
    }

    handlesLandscapeClick = event => {
        const { router } = this.context
        router.push({ pathname: '/protected' })
    }
}

LandscapeDetails.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterLandscapes: PropTypes.func.isRequired,
    leaveLandscapes: PropTypes.func.isRequired
}

LandscapeDetails.contextTypes = {
    router: PropTypes.object
}

export default LandscapeDetails
