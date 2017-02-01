import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import RightNavButton from './rightNavButton/RightNavButton'
import { Row, Col } from 'react-flexbox-grid'
import { IoPerson } from 'react-icons/lib/io'
import { FlatButton, IconMenu, IconButton, MenuItem } from 'material-ui'

class RightNav extends Component {

    state = {
        userMenu: false
    }

    render() {
        const { rightLinks, onRightNavButtonClick, user, userIsAuthenticated } = this.props

        return (
            <Row between='xs'>
                {
                    userIsAuthenticated
                    ?
                        rightLinks.filter(btnLink => ((btnLink.showWhenUserAuth === true) && (btnLink.showOnUserDropdown === false))).map((aLinkBtn, index) => {
                            return (
                                <RightNavButton key={index} link={aLinkBtn.link} label={aLinkBtn.label}
                                    viewName={aLinkBtn.view} onClick={onRightNavButtonClick}/>
                            )
                        })
                    :
                        rightLinks.filter(btnLink => ((btnLink.showWhenUserAuth === false) || (btnLink.alwaysShows === true))).map((aLinkBtn, index) => {
                            return (
                                <RightNavButton key={index} link={aLinkBtn.link} label={aLinkBtn.label}
                                    viewName={aLinkBtn.view} onClick={onRightNavButtonClick}/>
                                )
                        })
                }
                <FlatButton onTouchTap={this.handleUsernameClick}
                    label={user.username} hoverColor={'none'}
                    labelStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    icon={<IoPerson/>}
                />
                <IconMenu
                    open={this.state.userMenu}
                    iconButtonElement={<span></span>}
                    onRequestChange={this.handleOnRequestChange}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        {
                            rightLinks.filter(btnLink => ((btnLink.showWhenUserAuth === true) && (btnLink.showOnUserDropdown === true))).map((aLinkBtn, index) => {
                                return (
                                    <Link key={index} to={aLinkBtn.link} onClick={this.handleRightNavItemClick}>
                                        <MenuItem primaryText={aLinkBtn.label}/>
                                    </Link>
                                )
                            })
                        }
                </IconMenu>
            </Row>
        )
    }

    handleRightNavItemClick = (event) => {
        const { onRightNavButtonClick, viewName } = this.props
        onRightNavButtonClick(event, viewName)
    }

    handleOnRequestChange = (event, value) => {
        if (value === 'clickAway')
            this.setState({ userMenu: !this.state.userMenu })
    }

    handleUsernameClick = event => {
        const { userMenu } = this.state
        this.setState({ userMenu: !userMenu })
    }
}

RightNav.propTypes = {
    rightLinks: PropTypes.arrayOf(PropTypes.shape({
        link: PropTypes.string,
        label: PropTypes.string,
        viewName: PropTypes.string
    })),
    onRightNavButtonClick: PropTypes.func,
    user: PropTypes.object,
    userIsAuthenticated: PropTypes.bool.isRequired
}

export default RightNav
