
import cx from 'classnames'
import { Table, Modal, Icon } from 'antd'
import { Loader } from '../../components'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

const confirm = Modal.confirm

class Accounts extends Component {

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

        const tableHeaders = [{
            title: 'Account Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a href="#">{text}</a>,
        }, {
            title: 'Region',
            dataIndex: 'region',
            key: 'region',
        }, {
            title: 'Date Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
        }, {
            title: '',
            key: 'action',
            render: (obj, record) => (
                <span>
                    <a onClick={this.handlesEditAccountClick.bind(this, obj)}>
                        <Icon style={{ fontSize: '16px', color: 'rgb(168, 168, 168)' }} type='edit'/>
                    </a>
                    <span className="ant-divider"/>
                    <a onClick={this.handlesDeleteAccountClick.bind(this, obj)}>
                        <Icon style={{ fontSize: '16px', color: 'rgb(168, 168, 168)' }} type='close'/>
                    </a>
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

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>

                <a onClick={this.handlesCreateAccountClick}>
                    <Icon style={{ fontSize: '20px' }} type='plus'/>
                </a>

                <Table columns={tableHeaders} dataSource={accounts} />

            </div>
        )
    }

    handlesCreateAccountClick = event => {
        const { router } = this.context
        router.push({ pathname: '/accounts/create' })
    }

    handlesEditAccountClick = (account, event) => {
        const { router } = this.context
        router.push({ pathname: '/accounts/edit/' + account._id })
    }

    handlesDeleteAccountClick = (accountToDelete, event) => {
        const { mutate } = this.props

        confirm({
            title: `Are you sure you want to delete ${accountToDelete.name}?`,
            okText: 'Yes',
            cancelText: 'Cancel',
            iconType: 'delete',
            onOk() {
                mutate({
                    variables: { account: accountToDelete }
                 }).then(({ data }) => {
                    console.log('deleted', data)
                }).catch((error) => {
                    console.log('there was an error sending the query', error)
                })
            },
            onCancel() {}
        })
    }
}

Accounts.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterLandscapes: PropTypes.func.isRequired,
    leaveLandscapes: PropTypes.func.isRequired
}

Accounts.contextTypes = {
    router: PropTypes.object
}

export default Accounts
