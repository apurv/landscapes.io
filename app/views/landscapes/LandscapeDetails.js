
import cx from 'classnames'
import { Loader } from '../../components'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Row, Col } from 'react-flexbox-grid'
import { IoEdit, IoAndroidClose, IoIosCloudUploadOutline } from 'react-icons/lib/io'
import { Card, CardHeader, CardText, FlatButton, RaisedButton, Tab, Tabs, TextField } from 'material-ui'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

class LandscapeDetails extends Component {

    state = {
        animated: true,
        viewEntersAnim: true
    }

    componentWillMount() {
        const { passLandscape, params } = this.props
        passLandscape(params.id)
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
        const { loading, landscapes, deploymentsByLandscapeId, params } = this.props

        console.log('%c this.props ', 'background: #1c1c1c; color: limegreen', this.props)

        const currentLandscape = landscapes.find(ls => { return ls._id === params.id })
        console.log('%c currentLandscape ', 'background: #1c1c1c; color: deepskyblue', currentLandscape)
        const parsedCFTemplate = JSON.parse(currentLandscape.cloudFormationTemplate)
        let currentDeployments = []
        let paramDetails = []

        if (deploymentsByLandscapeId) {
            currentDeployments = deploymentsByLandscapeId.filter(d => { return d.landscapeId === params.id })
        }

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
                    </Col>
                </Row>
                <Tabs>
                    <Tab label='Deployments'>
                        <CardHeader style={{ background: '#e6e6e6' }}>
                            <Row between='xs'>
                                <Col xs={3}><label>Deployment Name</label></Col>
                                <Col xs={3}><label>Region</label></Col>
                                <Col xs={3}><label>Date Created</label></Col>
                                <Col xs={3}><label>Status</label></Col>
                            </Row>
                        </CardHeader>
                        {
                            currentDeployments.map((deployment, index) => {
                                return (
                                    <Card key={index}>
                                        <CardHeader actAsExpander={true} showExpandableButton={true}>
                                            <Row between='xs'>
                                                <Col xs={3}>{deployment.stackName}</Col>
                                                <Col xs={3}>{deployment.location}</Col>
                                                <Col xs={3}>{deployment.createdAt}</Col>
                                                <Col xs={3}>
                                                    <FlatButton onTouchTap={this.handlesEditDeploymentClick}>
                                                        <IoEdit/>
                                                    </FlatButton>
                                                    <FlatButton onTouchTap={this.handlesDialogToggle}>
                                                        <IoAndroidClose/>
                                                    </FlatButton>
                                                </Col>
                                            </Row>
                                        </CardHeader>
                                        <CardText key={index} expandable={true}>
                                            {
                                                getDeploymentInfo(deployment)
                                            }
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
