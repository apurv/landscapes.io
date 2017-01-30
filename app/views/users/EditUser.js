import cx from 'classnames'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

import { Checkbox, RaisedButton} from 'material-ui'
import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Snackbar from 'material-ui/Snackbar';

import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';

import Slider from 'material-ui/Slider';
import {RadioButtonGroup, RadioButton} from 'material-ui/RadioButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import FlatButton from 'material-ui/FlatButton';

import { Loader } from '../../components'

const CheckboxGroup = Checkbox.Group;

const TabPane = Tabs.TabPane;

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

class EditUser extends Component {

    state = {
        animated: true,
        viewEntersAnim: true,
        indeterminate: true,
        successOpen: false,
        failOpen: false,

        checkAll: false,
          permissionC: false,
          permissionU: false,
          permissionD: false,
          permissionX: false,

          fixedHeader: true,
          fixedFooter: true,
          stripedRows: true,
          showRowHover: true,
          selectable: true,
          multiSelectable: true,
          enableSelectAll: true,
          deselectOnClickaway: true,
          showCheckboxes: true,
          height:'300'
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
        const { loading, groups, landscapes, users, params } = this.props

        let currentUser = users.find(ls => { return ls._id === params.id })
        let userGroups = []
        let currentGroups = []
        groups.find(group => {
          console.log('%c group ', 'background: #1c1c1c; color: rgb(200, 29, 238)', group)
            if(group.users){
              return group.users.find(user => {
                console.log('%c group.users user ', 'background: #1c1c1c; color: rgb(100, 29, 238)', user)
                if(user.userId === currentUser._id){
                  console.log('%c EQUALS', 'background: #1c1c1c; color: rgb(0, 29, 238)')
                  group.selected = true;
                  console.log('group=====', group)
                }
                return
              })
              currentGroups.push(group)
            }
            else {
              currentGroups.push(group)
              return
            }
        })
        this.setState({currentGroups: currentGroups})

        this.setState({currentUser})
        this.setState({ _id:currentUser._id, password: currentUser.password, username: currentUser.username, role: currentUser.role, email: currentUser.email, firstName: currentUser.firstName, lastName: currentUser.lastName})
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
        const { loading, groups, landscapes, users, params } = this.props

        let currentGroups = [];
        if(!this.state.currentGroups){
          currentGroups = groups
        }
        else{
          currentGroups = this.state.currentGroups
        }
        console.log('GROUPS', groups)
        console.log('currentGroups', currentGroups)
        console.log('landscapes', landscapes)
        console.log('users', users)
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
            <Snackbar
              open={this.state.successOpen}
              message="User successfully updated."
              autoHideDuration={3000}
              onRequestClose={this.handleRequestClose}
            />
            <Snackbar
              open={this.state.failOpen}
              message="Error updating user"
              autoHideDuration={3000}
              onRequestClose={this.handleRequestClose}
            />
            {
              console.log('this.state.username', this.state.username)
            }

                <h4>Edit User</h4><br/>
                <Tabs >
                  <Tab label="User" key="1">
                  <div style={styles.root}>
                  <GridList
                    cols={1}
                    cellHeight='auto'
                    style={styles.gridList}
                  >
                      <GridTile
                        key='username'
                      >

                      <TextField style={{width:450}} id="username" floatingLabelText="Username" value={this.state.username} onChange={this.handlesOnUsernameChange}  placeholder='Username' />
                      </GridTile>
                      <GridTile
                        key='email'
                      >
                      <TextField style={{width:450}} id="email" floatingLabelText="Email" value={this.state.email} onChange={this.handlesOnEmailChange}  placeholder='user@email.com' />
                      </GridTile>
                      <GridTile
                        key='firstName'
                      >
                      <TextField style={{width:450}} id="firstName" floatingLabelText="First Name" value={this.state.firstName} onChange={this.handlesOnFirstNameChange} placeholder='First Name' />
                      </GridTile>
                      <GridTile
                        key='lastName'
                      >
                      <TextField style={{width:450}} id="lastName" floatingLabelText="Last Name" value={this.state.lastName} onChange={this.handlesOnLastNameChange} placeholder='Last Name' />
                      </GridTile>
                      <GridTile
                        key='role'
                      >
                      <RadioButtonGroup style={{width:450, margin: 5}} name="role" id="role" valueSelected={this.state.role} onChange={this.handleRoleChange}>
                            <RadioButton
                              value="admin"
                              label="Global Admin"
                            />
                            <RadioButton
                              value="user"
                              label="User"
                            />
                          </RadioButtonGroup>
                    </GridTile>
                    <GridTile
                      key='SubmitButton'
                    >
                    <RaisedButton style={{width:450, margin: 5}} primary={true} disabled={loading} label="Submit" onClick={this.handlesCreateClick} />
                    </GridTile>
                  </GridList>
                  </div>
                  </Tab>
                  <Tab label="Groups" key="2">
                  <Table height={this.state.height} deselectOnClickaway={false} fixedHeader={this.state.fixedHeader} fixedFooter={this.state.fixedFooter}
                          selectable={this.state.selectable} multiSelectable={this.state.multiSelectable}
                          onRowSelection={this.handleOnRowSelection}>
                            <TableHeader displaySelectAll={this.state.showCheckboxes} adjustForCheckbox={this.state.showCheckboxes}
                              enableSelectAll={this.state.enableSelectAll} >
                              <TableRow>
                                <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Permissions">Permissions</TableHeaderColumn>
                              </TableRow>
                            </TableHeader>
                            <TableBody deselectOnClickaway={false}	 displayRowCheckbox={this.state.showCheckboxes}
                              showRowHover={this.state.showRowHover} stripedRows={this.state.stripedRows} >
                              {currentGroups.map( (row, index) => (
                                <TableRow key={row._id} selected={true} >
                                  <TableRowColumn>{row.name}</TableRowColumn>
                                  <TableRowColumn>{row.permissions}</TableRowColumn>
                                </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter adjustForCheckbox={this.state.showCheckboxes}   >
                              <TableRow>
                                <TableRowColumn>Email</TableRowColumn>
                                <TableRowColumn>Username</TableRowColumn>
                                <TableRowColumn>Role</TableRowColumn>
                              </TableRow>
                            </TableFooter>
                          </Table>

                  </Tab>
                </Tabs>
            </div>
        )
    }

    handleRoleChange= event => {
        if(this.state.role === 'admin'){
          this.setState({role: ''})
        }
    }

    handleOnRowSelection= selectedRows => {
        console.log('THIS IS A ROW CHANGE', selectedRows)
        const groups = this.state.groups;
        const currentUser = this.state.currentUser;
        for(var i=0; i< selectedRows.length; i++){
            console.log(groups[selectedRows[i]]._id)
            currentUser.groups.push(groups[selectedRows[i]]._id)
        }

    }

    handlesOnEmailChange = event => {
        event.preventDefault()
        // should add some validator before setState in real use cases
        this.setState({ email: event.target.value })
    }

    handlesOnPasswordChange = event => {
        event.preventDefault()
        // should add some validator before setState in real use cases
        this.setState({ password: event.target.value })
    }
    handlesOnUsernameChange = event => {
        event.preventDefault()
        // should add some validator before setState in real use cases
        this.setState({ username: event.target.value })
    }
    handlesOnFirstNameChange = event => {
        event.preventDefault()
        console.log('first name = ', event.target.value)
        // should add some validator before setState in real use cases
        this.setState({ firstName: event.target.value })
    }
    handlesOnLastNameChange = event => {
        event.preventDefault()
        // should add some validator before setState in real use cases
        this.setState({ lastName: event.target.value })
    }

    handlesCreateClick = event => {

        event.preventDefault()

        // let userToCreate = this.props.form.getFieldsValue()
        let userToEdit = {
          _id: this.state._id,
          username: this.state.username,
          email: this.state.email,
          firstName: this.state.firstName,
          lastName: this.state.lastName
        };
        console.log('UPDATING user -', userToEdit)
        console.log('this.props -', this.props)

        for (var i = 0; i< this.state.currentUser.groups; i++){
          let groupToUpdate = groups.find(ls => { return ls._id === this.state.currentUser.groups[i] })
          groups.users.push({ isAdmin: false, userId: this.state._id })
          this.props.EditGroupWithMutation({
              variables: { group: groupToUpdate }
           }).then(({ data }) => {
              console.log('got data', data)
          }).catch((error) => {
            console.log('error: ', error)
        })
      }
        this.props.EditUserWithMutation({
            variables: { user: userToEdit }
         }).then(({ data }) => {
           const { router } = this.context

            console.log('got data', data)
            this.setState({
              successOpen: true
            })
            router.push({ pathname: '/users' })
        }).catch((error) => {
          this.setState({
            failOpen: true
          })
            console.log('there was an error sending the query', error)
        })

    }

    closeError = (event) => {
        event.preventDefault()
        const { resetError } = this.props
        resetError()
    }
}

EditUser.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterUsers: PropTypes.func.isRequired,
    leaveUsers: PropTypes.func.isRequired
}

EditUser.contextTypes = {
    router: PropTypes.object
}

export default (EditUser)
