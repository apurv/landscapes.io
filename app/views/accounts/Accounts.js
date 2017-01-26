
import cx from 'classnames'
import { Card, Icon } from 'antd'
import { Loader } from '../../components'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

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

        if (loading) {
            return (
                <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Loader/>
                </div>
            )
        }

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>

                <a onClick={this.handlesCreateLandscapeClick}>
                    <Icon style={{ fontSize: '20px' }} type='plus'/>
                </a>

                <ul>
                    {
                        accounts.map((account, i) =>
                        <Card key={i} title={account.name} style={{ width: 300, margin: '20px', float: 'left' }}
                            extra={
                                <div>
                                    <a onClick={this.handlesEditLandscapeClick.bind(this, account)}>
                                        <Icon style={{ fontSize: '20px' }} type='edit'/>
                                    </a>
                                    <a onClick={this.handlesLandscapeClick.bind(this, account)}>
                                        <Icon style={{ fontSize: '20px' }} type='loading'/>
                                    </a>
                                </div>
                            }>
                            {/* <p>{account.description}</p> */}
                        </Card>)
                    }
                </ul>
            </div>
        )
    }

    handlesCreateLandscapeClick = event => {
        const { router } = this.context
        router.push({ pathname: '/accounts/create' })
    }

    handlesEditLandscapeClick = (landscape, event) => {
        const { router } = this.context
        router.push({ pathname: '/accounts/edit/' + landscape._id })
    }

    handlesLandscapeClick = (landscape, event) => {
        const { router } = this.context
        router.push({ pathname: '/account/' + landscape._id })
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
