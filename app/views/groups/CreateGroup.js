import cx from 'classnames'
import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import {Row, Col} from 'react-flexbox-grid'

import {Checkbox, RaisedButton} from 'material-ui'
import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Snackbar from 'material-ui/Snackbar';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import {RadioButtonGroup, RadioButton} from 'material-ui/RadioButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone'
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import UploadIcon from 'material-ui/svg-icons/file/file-upload'
import defaultUserImage from '../../style/empty.png'
import defaultImage from '../../style/empty-group.png'
import AvatarCropper from "react-avatar-cropper";
import ReactDom from "react-dom";

import {Loader} from '../../components'

import '../../style/avatar-cropper.style.scss'
const CheckboxGroup = Checkbox.Group;

const defaultCheckedList = ['r'];

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    },
    gridList: {
        width: 500,
        overflowY: 'auto'
    },
    chip: {
        margin: 4
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap'
    }
};

class CreateGroup extends Component {

    state = {
        animated: true,
        viewEntersAnim: true,
        checkedList: defaultCheckedList,
        indeterminate: true,
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
          successOpen: false,
          failOpen: false,
          height:'300'
    }
    
    componentDidMount() {
        const { enterGroups } = this.props
        enterGroups()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }
    componentWillMount(){
      this.setState({imageUri: defaultImage})
    }
    componentWillReceiveProps(nextProps){
      this.setState({imageUri: defaultImage})
    }

    componentWillUnmount() {
        const { leaveGroups } = this.props
        leaveGroups()
    }

    render() {

        let self = this
        const { animated, viewEntersAnim } = this.state
        const { loading, groups, landscapes, users } = this.props

        var stateUsers = []
        if(users){
          users.map(user => {
            if(!user.imageUri){
              user.imageUri = defaultUserImage
            }
            stateUsers.push(user)
          })
        }

        if(landscapes){
          console.log('landscapes', landscapes)
          var landscapeIds = landscapes.map((index, landscape) =>{
            return {key: landscape._id, id: landscape._id, name: landscape.name, description: landscape.description}
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
          <div>
              <Row className={cx({'screen-width': true, 'animatedViews': animated, 'view-enter': viewEntersAnim})} style={{
                  justifyContent: 'space-between'
              }}>
                  <h4>Edit Group</h4><br/>
                  <RaisedButton primary={true} label="Save" onClick={this.handlesCreateClick}/>
              </Row>
              <Row center='xs' middle='xs' className={cx({'animatedViews': animated, 'view-enter': viewEntersAnim})}>
                  {console.log('stateUsers', stateUsers)}
                  <Snackbar open={this.state.successOpen} message="Group successfully updated." autoHideDuration={3000} onRequestClose={this.handleRequestClose}/>
                  <Snackbar open={this.state.failOpen} message="Error updating group" autoHideDuration={3000} onRequestClose={this.handleRequestClose}/>
                  <Tabs>
                      <Tab label="Group" key="1">
                          <div style={styles.root}>

                              <GridList cols={1} cellHeight='auto' style={styles.gridList}>
                                  <GridTile key='name'>

                                      <TextField style={{
                                          width: 450
                                      }} id="username" floatingLabelText="Name" onChange={this.handlesOnNameChange}/>
                                  </GridTile>
                                  <GridTile key='description'>
                                      <TextField id="description" style={{
                                          width: 450
                                      }} multiLine={true} rows={2} rowsMax={4} floatingLabelText="Description" onChange={this.handlesOnDescriptionChange}  hintText='Description'/>
                                  </GridTile>
                                  <GridTile key='firstName'>
                                      <div style={{
                                          borderBottom: '1px solid #E9E9E9',
                                          width: 450
                                      }}>
                                          <Checkbox style={{
                                              margin: 5
                                          }} label="Check All Permissions" onCheck={this.handlesOnCheck} checked={this.state.checkAll}/>
                                      </div>
                                      <br/>
                                      <Checkbox label="Create" checked={this.state.permissionC} onCheck={this.handlesPermissionClickC}/>
                                      <Checkbox label="Read" disabled={true} checked={true}/>
                                      <Checkbox label="Update" checked={this.state.permissionU} onCheck={this.handlesPermissionClickU}/>
                                      <Checkbox label="Delete" checked={this.state.permissionD} onCheck={this.handlesPermissionClickD}/>
                                      <Checkbox label="Execute" checked={this.state.permissionX} onCheck={this.handlesPermissionClickX}/>
                                  </GridTile>
                                  <GridTile key='image'>
                                      <Dropzone id='imageUri' onDrop={this.handlesImageUpload} multiple={false} accept='image/*' style={{
                                          marginLeft: '10px',
                                          width: '180px',
                                          padding: '15px 0px'
                                      }}>
                                          <div className="avatar-photo">
                                              <div className="avatar-edit">
                                                  <span>Click to Choose Image</span>
                                                  <i className="fa fa-camera"></i>
                                              </div>
                                              <img src={this.state.croppedImg || this.state.imageUri} style={{
                                                  width: 200
                                              }}/>
                                          </div>
                                          {this.state.cropperOpen &&
                                            <AvatarCropper onRequestHide={this.handleRequestHide} cropperOpen={this.state.cropperOpen} onCrop={this.handleCrop} image={this.state.img} width={400} height={400}/>
                                          }
                                      </Dropzone>
                                  </GridTile>
                              </GridList>
                          </div>
                      </Tab>
                      <Tab label="Users" key="2">
                          <div style={styles.wrapper}>
                              {
                                stateUsers.map((row, index) => {
                                  < Chip
                                  style = { styles.chip } onRequestDelete = {this.handleRequestDelete} >
                                  <Avatar src={stateUsers.imageUri}/>
                                  {row.firstName}
                                  {row.lastName}
                                  < /Chip>
                              })
                            }
                          </div>
                          <Table height={this.state.height} fixedHeader={this.state.fixedHeader} fixedFooter={this.state.fixedFooter} selectable={this.state.selectable} multiSelectable={this.state.multiSelectable} onRowSelection={this.handleOnRowSelectionUsers}>
                              <TableHeader displaySelectAll={this.state.showCheckboxes} adjustForCheckbox={this.state.showCheckboxes} enableSelectAll={this.state.enableSelectAll}>
                                  <TableRow>
                                      <TableHeaderColumn tooltip="Image"></TableHeaderColumn>
                                      <TableHeaderColumn tooltip="Email">Email</TableHeaderColumn>
                                      <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
                                      <TableHeaderColumn tooltip="Role">Role</TableHeaderColumn>
                                  </TableRow>
                              </TableHeader>
                              <TableBody displayRowCheckbox={this.state.showCheckboxes} deselectOnClickaway={false} showRowHover={this.state.showRowHover} stripedRows={false}>
                                  {stateUsers.map((row, index) => (
                                      <TableRow key={row._id} selected={row.selected}>
                                          <TableRowColumn><img src={row.imageUri} style={{
                                          width: 40,
                                          borderRadius: 50
                                      }}/></TableRowColumn>
                                          <TableRowColumn>{row.email}</TableRowColumn>
                                          <TableRowColumn>{row.firstName} {row.lastName}</TableRowColumn>
                                          <TableRowColumn>{row.role}</TableRowColumn>
                                      </TableRow>
                                  ))}
                              </TableBody>
                              <TableFooter adjustForCheckbox={this.state.showCheckboxes}></TableFooter>
                          </Table>

                      </Tab>
                      <Tab label="Landscapes" key="3">
                          <Table height={this.state.height} fixedHeader={this.state.fixedHeader} fixedFooter={this.state.fixedFooter} selectable={this.state.selectable} multiSelectable={this.state.multiSelectable} onRowSelection={this.handleOnRowSelectionLandscapes}>
                              <TableHeader displaySelectAll={this.state.showCheckboxes} adjustForCheckbox={this.state.showCheckboxes} enableSelectAll={this.state.enableSelectAll}>
                                  <TableRow>
                                      <TableHeaderColumn tooltip="Image"></TableHeaderColumn>
                                      <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
                                      <TableHeaderColumn tooltip="Description">Description</TableHeaderColumn>
                                  </TableRow>
                              </TableHeader>
                              <TableBody displayRowCheckbox={this.state.showCheckboxes} deselectOnClickaway={false} showRowHover={this.state.showRowHover} stripedRows={false}>
                                  {landscapes.map((row, index) => (
                                      <TableRow key={row._id} selected={row.selected}>
                                          <TableRowColumn><img src={row.imageUri} style={{
                                          width: 50
                                      }}/></TableRowColumn>
                                          <TableRowColumn>{row.name}</TableRowColumn>
                                          <TableRowColumn>{row.description}</TableRowColumn>
                                      </TableRow>
                                  ))}
                              </TableBody>
                              <TableFooter adjustForCheckbox={this.state.showCheckboxes}></TableFooter>
                          </Table>
                      </Tab>
                  </Tabs>
              </Row>
          </div>
        )
    }

    getInitialState = () => {
        return {
          cropperOpen: false,
          img: null,
          croppedImg: defaultImage
        };
      }
      handleFileChange = (dataURI) => {
        this.setState({
          img: dataURI,
          croppedImg: this.state.croppedImg,
          cropperOpen: true
        });
      }
      handleCrop = (dataURI) => {
        this.setState({
          cropperOpen: false,
          img: null,
          croppedImg: dataURI
        });
      }
      handleRequestHide = () =>{
        this.setState({
          cropperOpen: false
        });
      }
    handleRequestDelete = () => {
      alert('You clicked the delete button.');
    }

    handleTouchTap = () => {
      alert('You clicked the Chip.');
    }

    handlesImageUpload = (acceptedFiles, rejectedFiles) => {
        let reader = new FileReader()

        reader.readAsDataURL(acceptedFiles[0])
        reader.onload = () => {
            this.setState({
                imageUri: reader.result,
                img: reader.result,
                croppedImg: this.state.croppedImg,
                cropperOpen: true,
                imageFileName: acceptedFiles[0].name
            })
        }

        reader.onerror = error => {
            console.log('Error: ', error)
        }
    }
    handlesOnNameChange = event => {
        // event.preventDefault()
        this.setState({name: event.target.value})
    }
    handlesOnDescriptionChange = event => {
        event.preventDefault()
        this.setState({description: event.target.value})
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


    handlesOnEmailChange = event => {
        event.preventDefault()
        // should add some validator before setState in real use cases
        this.setState({ username: event.target.value })
    }

    handlesOnPasswordChange = event => {
        event.preventDefault()
        // should add some validator before setState in real use cases
        this.setState({ password: event.target.value })
    }

    handlesCreateClick = event => {
        const { router } = this.context

        event.preventDefault()

        let groupToCreate = {
          name: this.state.name,
          description: this.state.description
        }
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
        groupToCreate.imageUri = this.state.croppedImg

        console.log('creating group -', groupToCreate)
        console.log('this.props -', this.props)
        this.props.CreateGroupWithMutation({
            variables: { group: groupToCreate }
         }).then(({ data }) => {
            console.log('got data', data)
            message.config({
              top: 5,
              duration: 5,
            });

            message.success('Group was successfully created.');
            // router.push({ pathname: '/groups' })
        }).then(() =>{
            this.props.refetchGroups({}).then(({ data }) =>{
              console.log('got MORE data', data);
              router.push({ pathname: '/groups' })
            }).catch((error) => {
                console.log('there was an error sending the SECOND query', error)
            })
        }).catch((error) => {
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

CreateGroup.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterGroups: PropTypes.func.isRequired,
    leaveGroups: PropTypes.func.isRequired,
    refetchGroups: PropTypes.func
}

CreateGroup.contextTypes = {
    router: PropTypes.object
}

export default CreateGroup
