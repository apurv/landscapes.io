
import cx from 'classnames'
import { Row, Col, Button, Tabs, Icon, Table } from 'antd'
import { Loader } from '../../components'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

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

        const data = [{
            key: '1',
            name: 'test-4-instance',
            status: 'deleted',
            createdAt: '12/16/2016 @ 12:02'
        }]

        if (loading) {
            return (
                <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Loader/>
                </div>
            )
        }

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>

                <Row type="flex">
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
                </Tabs>

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
