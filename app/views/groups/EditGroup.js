
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

const defaultCheckedList = ['r'];

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

const TabPane = Tabs.TabPane;


class EditGroup extends Component {

    state = {
        animated: true,
        viewEntersAnim: true,
        checkedList: defaultCheckedList,
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
        const { enterGroups } = this.props
        const { loading, groups, landscapes, users, params } = this.props

        let currentGroup = groups.find(ls => { return ls._id === params.id })
        console.log('%c currentGroup ', 'background: #1c1c1c; color: rgb(209, 29, 238)', currentGroup)
        this.setState({currentGroup: currentGroup})
        this.setState({name: currentGroup.name})
        this.setState({description: currentGroup.description})

        if(currentGroup){
          currentGroup.permissions.map(value => {
            if(value === 'c'){
              this.setState({permissionC: true})
            }
            if(value === 'u'){
              this.setState({permissionU: true})
            }
            if(value === 'd'){
              this.setState({permissionD: true})
            }
            if(value === 'x'){
              this.setState({permissionX: true})
            }
          })
        }
        enterGroups()
    }


    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
        const { leaveGroups } = this.props
        leaveGroups()
    }

    render() {

        let self = this
        const { animated, viewEntersAnim } = this.state
        const { loading, groups, landscapes, users, params } = this.props

        console.log('GROUPS', groups)
        console.log('landscapes', landscapes)
        console.log('users', users)

        if(landscapes){
          console.log('landscapes', landscapes)
          // var landscapeIds = landscapes.map((index, landscape) =>{
          //   return {key: landscape._id, id: landscape._id, name: landscape.name, description: landscape.description}
          // })
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
              message="Group successfully updated."
              autoHideDuration={3000}
              onRequestClose={this.handleRequestClose}
            />
            <Snackbar
              open={this.state.failOpen}
              message="Error updating group"
              autoHideDuration={3000}
              onRequestClose={this.handleRequestClose}
            />
                <h4>Edit Group</h4><br/>
                <Tabs >
                  <Tab label="Group" key="1">
                  <div style={styles.root}>

                  <GridList
                    cols={1}
                    cellHeight='auto'
                    style={styles.gridList}
                  >
                      <GridTile
                        key='name'
                      >

                      <TextField style={{width:450}} id="username" floatingLabelText="Name" value={this.state.name} onChange={this.handlesOnNameChange}  placeholder='Username' />
                      </GridTile>
                      <GridTile
                        key='description'
                      >
                      <TextField style={{width:450}} multiLine={true} rows={2} rowsMax={4} floatingLabelText="Description" onChange={this.handlesOnDescriptionChange}  defaultValue={this.state.description} hintText='Description' />
                      </GridTile>
                      <GridTile
                        key='firstName'
                      >
                      <div style={{ borderBottom: '1px solid #E9E9E9', width:450 }}>
                        <Checkbox style={{margin:5}} label="Check All Permissions" onCheck={this.handlesOnCheck} checked={this.state.checkAll}/>
                      </div>
                      <br />
                      <Checkbox label="Create" checked={this.state.permissionC} onCheck={this.handlesPermissionClickC}/>
                      <Checkbox label="Read" disabled={true} checked={true} />
                      <Checkbox label="Update" checked={this.state.permissionU} onCheck={this.handlesPermissionClickU}/>
                      <Checkbox label="Delete" checked={this.state.permissionD} onCheck={this.handlesPermissionClickD}/>
                      <Checkbox label="Execute" checked={this.state.permissionX} onCheck={this.handlesPermissionClickX}/>
                    </GridTile>
                    <GridTile
                      key='SubmitButton'
                    >
                    <RaisedButton style={{width:450}} type='primary' disabled={loading} primary={true} label="Submit" onClick={this.handlesCreateClick} />
                    </GridTile>
                  </GridList>
                  </div>
                  </Tab>
                  <Tab label="Users" key="2">
                  <Table height={this.state.height} fixedHeader={this.state.fixedHeader} fixedFooter={this.state.fixedFooter}
                          selectable={this.state.selectable} multiSelectable={this.state.multiSelectable}
                          onRowSelection={this.handleOnRowSelection}>
                            <TableHeader displaySelectAll={this.state.showCheckboxes} adjustForCheckbox={this.state.showCheckboxes}
                              enableSelectAll={this.state.enableSelectAll} >
                              <TableRow>
                                <TableHeaderColumn tooltip="Email">Email</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Username">Username</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Role">Role</TableHeaderColumn>
                              </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={this.state.showCheckboxes} deselectOnClickaway={this.state.deselectOnClickaway}
                              showRowHover={this.state.showRowHover} stripedRows={this.state.stripedRows}>
                              {users.map( (row, index) => (
                                <TableRow key={index} selected={row.selected}>
                                  <TableRowColumn>{row.email}</TableRowColumn>
                                  <TableRowColumn>{row.username}</TableRowColumn>
                                  <TableRowColumn>{row.role}</TableRowColumn>
                                </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter
                              adjustForCheckbox={this.state.showCheckboxes}
                            >
                              <TableRow>
                                <TableRowColumn>Email</TableRowColumn>
                                <TableRowColumn>Username</TableRowColumn>
                                <TableRowColumn>Role</TableRowColumn>
                              </TableRow>
                            </TableFooter>
                          </Table>

                  </Tab>
                  <Tab label="Landscapes" key="3">
                  <Table height={this.state.height} fixedHeader={this.state.fixedHeader} fixedFooter={this.state.fixedFooter}
                          selectable={this.state.selectable} multiSelectable={this.state.multiSelectable}
                          onRowSelection={this.handleOnRowSelection}>
                            <TableHeader displaySelectAll={this.state.showCheckboxes} adjustForCheckbox={this.state.showCheckboxes}
                              enableSelectAll={this.state.enableSelectAll} >
                              <TableRow>
                                <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Description">Description</TableHeaderColumn>
                              </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={this.state.showCheckboxes} deselectOnClickaway={this.state.deselectOnClickaway}
                              showRowHover={this.state.showRowHover} stripedRows={this.state.stripedRows}>
                              {landscapes.map( (row, index) => (
                                <TableRow key={index} selected={row.selected}>
                                  <TableRowColumn>{row.name}</TableRowColumn>
                                  <TableRowColumn>{row.description}</TableRowColumn>
                                </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter
                              adjustForCheckbox={this.state.showCheckboxes}
                            >
                              <TableRow>
                                <TableRowColumn>Name</TableRowColumn>
                                <TableRowColumn>Description</TableRowColumn>
                              </TableRow>
                            </TableFooter>
                          </Table>
                  </Tab>
                </Tabs>
            </div>
        )
    }

    handlesGroupClick = event => {
        const { router } = this.context
        router.push({ pathname: '/protected' })
    }
    handlesPermissionClickC = event => {
        this.setState({permissionC: !this.state.permissionC})
    }
    handlesPermissionClickU = event => {
        this.setState({permissionU: !this.state.permissionU})
    }
    handlesPermissionClickD = event => {
        this.setState({permissionD: !this.state.permissionD})
    }
    handlesPermissionClickX = event => {
        this.setState({permissionX: !this.state.permissionX})
    }

    handlesOnCheck = event => {
        var isChecked = this.state.checkAll;
        console.log(isChecked)
        if(isChecked){
          this.setState({
              permissionC: false,
              permissionU: false,
              permissionD: false,
              permissionX: false,
            checkAll: false
          })
        }
        else{
          this.setState({
              permissionC: true,
              permissionU: true,
              permissionD: true,
              permissionX: true,
            checkAll: true
          })
        }
    }

    handlesCreatePermission = () => {
        var permissions = [];
        if(this.state.permissionC){
          permissions.push('c')
        }

        permissions.push('r')

        if(this.state.permissionU){
          permissions.push('u')
        }
        if(this.state.permissionD){
          permissions.push('d')
        }
        if(this.state.permissionX){
          permissions.push('x')
        }
        console.log('permissions', permissions)
        return permissions;
    }
    handlesOnNameChange = event => {
        event.preventDefault()
        // should add some validator before setState in real use cases
        this.setState({ name: event.target.value })
    }
    handlesOnDescriptionChange = event => {
        event.preventDefault()
        // should add some validator before setState in real use cases
        this.setState({ description: event.target.value })
    }
    handlesCreateClick = event => {
        const { router } = this.context

        event.preventDefault()

        let groupToCreate = {
          name: this.state.name,
          description: this.state.description,
          _id: this.state.currentGroup._id
        };

        groupToCreate.permissions = this.handlesCreatePermission()
        groupToCreate.users = []
        // groupToCreate.landscapes = this.state.selectedRows;
        console.log('this.state.selectedRows', this.state.selectedRows)
        if(this.state.selectedRows){
          groupToCreate.landscapes = this.state.selectedRows.map((row, i) =>{
            return row._id
          });
        }
        else{
          groupToCreate.landscapes = []
        }

        console.log('creating group -', groupToCreate)
        console.log('this.props -', this.props)
        this.props.EditGroupWithMutation({
            variables: { group: groupToCreate }
         }).then(({ data }) => {
            console.log('got data', data)

            this.setState({
              successOpen: true
            })
            router.push({ pathname: '/groups' })
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
    onCheckedChange = (checkedList) =>{
      this.setState({
        checkedList,
        indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
        checkAll: checkedList.length === plainOptions.length,
      });
      console.log(this.state)
    }
    onCheckAllChange = (e) => {
      this.setState({
        checkedList: e.target.checked ? allChecked : ['r'],
        indeterminate: false,
        checkAll: e.target.checked,
      });
      console.log(this.state)
    }

    callback = (key) => {
      console.log(key);
    }
}

EditGroup.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterGroups: PropTypes.func.isRequired,
    leaveGroups: PropTypes.func.isRequired
}

EditGroup.contextTypes = {
    router: PropTypes.object
}

export default EditGroup
