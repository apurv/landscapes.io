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


class GroupDetails extends Component {

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
          height:'300',
          currentGroup: {}
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
        const { enterGroupDetails, groups, params } = this.props
        if(groups){
          let currentGroup = groups.find(ls => { return ls._id === params.id })
          this.setState({currentGroup: currentGroup})
        }
        console.log('groups- ---- componentDidMount', groups)
        enterGroupDetails()
    }

    componentWillReceiveProps(nextProps) {
      // use the name from nextProps to get the profile
      const { enterGroupDetails, groups, params } = nextProps
      if(groups){
        let currentGroup = groups.find(ls => { return ls._id === params.id })
        this.setState({currentGroup: currentGroup})
      }
      console.log('groups- ---- componentWillMount', groups)
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate nextProps', nextProps)
        console.log('shouldComponentUpdate nextState', nextState)
        return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
        const { leaveGroupDetails } = this.props
        leaveGroupDetails()
    }

    render() {

        let self = this
        const { animated, viewEntersAnim } = this.state
        const { loading, groups, landscapes, users, params } = this.props

        console.log('GROUPS', groups)
        if (loading || !groups) {
            return (
                <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Loader/>
                </div>
            )
        }

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                <h4><strong>Group:</strong> {this.state.currentGroup.name}</h4><br/>
                  <div style={styles.root}>

                  <Card style={{padding:20}}>
                  <GridList
                    cols={1}
                    cellHeight='auto'
                    style={styles.gridList}
                  >
                      <GridTile key='name'>
                        <p>Name: {this.state.currentGroup.name} </p>
                      </GridTile>
                      <GridTile key='description' >
                        <p>Description: {this.state.currentGroup.description} </p>
                      </GridTile>
                      <GridTile key='permissions'>
                      <p> Permissions: {this.state.currentGroup.permissions} </p>
                    </GridTile>
                    <GridTile>
                        <Table height={this.state.height} fixedHeader={this.state.fixedHeader} fixedFooter={this.state.fixedFooter}
                            selectable={this.state.selectable} multiSelectable={this.state.multiSelectable}
                            onRowSelection={this.handleOnRowSelection}>
                              <TableHeader displaySelectAll={this.state.showCheckboxes} adjustForCheckbox={this.state.showCheckboxes}
                                enableSelectAll={this.state.enableSelectAll} >
                                <TableRow>
                                  <TableHeaderColumn colSpan="3" tooltip="Landscapes" style={{textAlign: 'center'}}>
                                    Landscapes
                                  </TableHeaderColumn>
                                </TableRow>
                                <TableRow>
                                  <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
                                </TableRow>
                              </TableHeader>
                              <TableBody displayRowCheckbox={this.state.showCheckboxes} deselectOnClickaway={this.state.deselectOnClickaway}
                                showRowHover={this.state.showRowHover} stripedRows={this.state.stripedRows}>
                                {groups.map( (row, index) => (
                                  <TableRow key={index} selected={row.selected}>
                                    <TableRowColumn>{row.name}</TableRowColumn>
                                  </TableRow>
                                  ))}
                              </TableBody>
                              <TableFooter
                                adjustForCheckbox={this.state.showCheckboxes}
                              >
                                <TableRow>
                                  <TableRowColumn>Name</TableRowColumn>
                                </TableRow>
                              </TableFooter>
                            </Table>
                    </GridTile>
                    <GridTile>
                        <Table height={this.state.height} fixedHeader={this.state.fixedHeader} fixedFooter={this.state.fixedFooter}
                            selectable={this.state.selectable} multiSelectable={this.state.multiSelectable}
                            onRowSelection={this.handleOnRowSelection}>
                              <TableHeader displaySelectAll={this.state.showCheckboxes} adjustForCheckbox={this.state.showCheckboxes}
                                enableSelectAll={this.state.enableSelectAll} >
                                <TableRow>
                                  <TableHeaderColumn colSpan="3" tooltip="Users" style={{textAlign: 'center'}}>
                                    Users
                                  </TableHeaderColumn>
                                </TableRow>
                                <TableRow>
                                  <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
                                </TableRow>
                              </TableHeader>
                              <TableBody displayRowCheckbox={this.state.showCheckboxes} deselectOnClickaway={this.state.deselectOnClickaway}
                                showRowHover={this.state.showRowHover} stripedRows={this.state.stripedRows}>
                                {groups.map( (row, index) => (
                                  <TableRow key={index} selected={row.selected}>
                                    <TableRowColumn>{row.name}</TableRowColumn>
                                  </TableRow>
                                  ))}
                              </TableBody>
                              <TableFooter
                                adjustForCheckbox={this.state.showCheckboxes}
                              >
                                <TableRow>
                                  <TableRowColumn>Name</TableRowColumn>
                                </TableRow>
                              </TableFooter>
                            </Table>
                    </GridTile>
                  </GridList>
                  </Card>
                  </div>
            </div>
        )
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

GroupDetails.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterGroupDetails: PropTypes.func.isRequired,
    leaveGroupDetails: PropTypes.func.isRequired
}

GroupDetails.contextTypes = {
    router: PropTypes.object
}

export default GroupDetails
