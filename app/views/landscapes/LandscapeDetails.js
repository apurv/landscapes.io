
import cx from 'classnames'
// import { Row, Col, Button, Tabs, Icon, Table } from 'antd'
import { Loader } from '../../components'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import { Row, Col } from 'react-flexbox-grid'
import { IoEdit, IoAndroidClose } from 'react-icons/lib/io'
import { Card, CardHeader, CardText, FlatButton, Tab, Tabs, TextField } from 'material-ui'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'

const TabPane = Tabs.TabPane

class LandscapeDetails extends Component {

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
        const { loading, landscapes, params } = this.props
        const currentLandscape = landscapes.find(ls => { return ls._id === params.id })
        const parsedCFTemplate = JSON.parse(currentLandscape.cloudFormationTemplate)

        console.log('%c currentLandscape ', 'background: #1c1c1c; color: rgb(209, 29, 238)', currentLandscape)

        const columns = [{
            title: 'Deployment Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a href="#">{text}</a>,
        }, {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        }, {
            title: 'Date Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a href="#" disabled>Delete</a>
                    <span className="ant-divider" />
                    <a href="#">Purge</a>
                </span>
            )
        }]

        if (loading) {
            return (
                <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Loader/>
                </div>
            )
        }

        let paramDetails = []

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                <Tabs>

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
                    <Tab label='Deployments'>
                        <Table>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow>
                                    <TableHeaderColumn>Deployment Name</TableHeaderColumn>
                                    <TableHeaderColumn>Status</TableHeaderColumn>
                                    <TableHeaderColumn>Date Created</TableHeaderColumn>
                                    <TableHeaderColumn></TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                <TableRow key={`${2}`}>
                                    <TableRowColumn>test-2</TableRowColumn>
                                    <TableRowColumn>ROLLBACK_COMPLETE</TableRowColumn>
                                    <TableRowColumn></TableRowColumn>
                                    <TableRowColumn>
                                        <FlatButton onTouchTap={this.handlesEditDeploymentClick}>
                                            <IoEdit/>
                                        </FlatButton>
                                        <FlatButton onTouchTap={this.handlesDialogToggle}>
                                            <IoAndroidClose/>
                                        </FlatButton>
                                    </TableRowColumn>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Tab>
                </Tabs>

                {/* <Row type="flex">
                    <Col span={12}>
                        <h4>Landscape Details</h4>
                    </Col>
                    <Col span={12}>
                        <Row type='flex' justify='end'>
                            <Button onClick={this.handlesCreateLandscapeClick}>
                                Deploy
                            </Button>
                        </Row>
                    </Col>
                </Row>

                <Tabs defaultActiveKey="1">
                    <TabPane tab="Template" key="1"><textarea rows={100} style={{ background: '#f9f9f9', fontFamily: 'monospace', width: '100%' }}>{currentLandscape.cloudFormationTemplate}</textarea></TabPane>
                    <TabPane tab="Resources" key="2">Content of Tab Pane 2</TabPane>
                    <TabPane tab="Parameters" key="3">Content of Tab Pane 3</TabPane>
                    <TabPane tab="Mappings" key="4">Content of Tab Pane 3</TabPane>
                    <TabPane tab="Deployments" key="5">
                        <Table columns={columns} dataSource={data} />
                    </TabPane>
                </Tabs> */}

            </div>
        )
    }

    handlesCreateLandscapeClick = event => {
        const { router } = this.context
        router.push({ pathname: '/landscapes/create' })
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
