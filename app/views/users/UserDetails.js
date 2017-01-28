import cx from 'classnames'
import { Loader } from '../../components'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

import { Checkbox, RaisedButton} from 'material-ui'
import {GridList, GridTile} from 'material-ui/GridList';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';

import Slider from 'material-ui/Slider';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import FlatButton from 'material-ui/FlatButton';



const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    overflowY: 'auto'
  },
};

class UserDetails extends Component {

    state = {
        animated: true,
        viewEntersAnim: true
    }

    static childContextTypes =
      {
          muiTheme: React.PropTypes.object
      }

      getChildContext()
      {
          return {
              muiTheme: getMuiTheme()
          }
      }


    componentDidMount() {
        const { enterUsers } = this.props
        enterUsers()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
        const { leaveUsers } = this.props
        leaveUsers()
    }


        render() {

            let self = this
            const { animated, viewEntersAnim } = this.state
            const { loading, users, params } = this.props

            let currentUser = users.find(ls => { return ls._id === params.id })

            const formItemLayout = {
                labelCol: { span: 8 },
                wrapperCol: { span: 12 }
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
                    <h4>User Details</h4>
                    <br/><br/>
                    <div style={styles.root}>

                    <GridList
                      cols={1}
                      cellHeight='auto'
                      style={styles.gridList}
                    >
                        <GridTile key='name'>
                        <p>First Name:  {currentUser.firstName} {currentUser.lastName}</p>
                        </GridTile>
                        <GridTile key='email' >
                        <p>Email:  {currentUser.email}</p>
                        </GridTile>
                        <GridTile key='username'>
                        <p>Username:  {currentUser.username}</p>
                      </GridTile>
                        <GridTile key='Role'>
                        <p>Role:  {currentUser.role}</p>
                      </GridTile>
                    </GridList>
                    </div>
              </div>
            )
        }

        handlesEditClick = event => {
          const { router } = this.context
          const { users, params } = this.props

          let currentUser = users.find(ls => { return ls._id === params.id })

          router.push({ pathname: `/users/edit/${currentUser._id}` })

        }

        closeError = (event) => {
            event.preventDefault()
            const { resetError } = this.props
            resetError()
        }
    }

UserDetails.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterUsers: PropTypes.func.isRequired,
    leaveUsers: PropTypes.func.isRequired
}

UserDetails.contextTypes = {
    router: PropTypes.object
}

export default UserDetails
