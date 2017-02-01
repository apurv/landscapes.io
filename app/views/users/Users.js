import cx from 'classnames'
import { IoEdit, IoLoadC, IoIosPlusEmpty } from 'react-icons/lib/io'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import FlatButton from 'material-ui/FlatButton';
import { Loader } from '../../components'
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import defaultImage from '../../style/empty.png'


class Users extends Component {

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
    componentWillReceiveProps(nextProps){
      const {users} = nextProps;
      if(users){
        for(var i = 0; i< users.length; i++){ //TODO: MUST BE REAL IMAGE
          if(!users[i].imageUri){
            users[i].imageUri = defaultImage
          }
        }
        this.setState({users: users});
      }
    }
    componentWillMount(){
      const { users } = this.props;
      if(users){
        for(var i = 0; i< users.length; i++){ //TODO: MUST BE REAL IMAGE
          if(!users[i].imageUri){
            users[i].imageUri = defaultImage
          }
        }
        this.setState({users: users});
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    componentWillUnmount() {
        const { leaveUsers } = this.props
        leaveUsers()
    }

    render() {
        const { animated, viewEntersAnim } = this.state
        const { loading } = this.props


        if (loading) {
            return (
                <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
                    <Loader/>
                </div>
            )
        }

        return (
            <div className={cx({ 'animatedViews': animated, 'view-enter': viewEntersAnim })}>
              {console.log('this.state.users', this.state.users)}
                <a onClick={this.handlesCreateGroupClick}>
                  <p style={{ fontSize: '20px' }}><IoIosPlusEmpty size={30}/>Add User</p>
                </a>

                <ul>
                    {
                        this.state.users.map((user, i) =>
                        <Card key={i} style={{ width: 300, margin: '20px', float: 'left' }}>
                            <CardHeader
                              title={user.username}
                              subtitle={user.email}
                              avatar={user.imageUri}
                              onClick={this.handlesGroupClick.bind(this, user)}
                            />
                            <CardText onClick={this.handlesGroupClick.bind(this, user)}>
                                  Name: {user.firstName} {user.lastName} <br></br>
                                  Role: {user.role}
                            </CardText>
                            <CardActions>
                              <FlatButton onClick={this.handlesEditGroupClick.bind(this, user)}>
                                <a onClick={this.handlesEditGroupClick.bind(this, user)}>
                                  <IoEdit size={20}/> EDIT
                                </a>
                              </FlatButton>
                              {/*<FlatButton onClick={this.handlesGroupClick.bind(this, user)}>
                                <a onClick={this.handlesGroupClick.bind(this, user)}>
                                  <Icon style={{ fontSize: '20px' }} type='select'/>
                                </a>
                              </FlatButton>*/}
                            </CardActions>
                        </Card>
                      )
                    }
                </ul>
            </div>
        )
    }

    handlesCreateGroupClick = event => {
        const { router } = this.context
        router.push({ pathname: '/users/create' })
    }

    handlesEditGroupClick = (user, event) => {
        const { router } = this.context
        router.push({ pathname: '/users/edit/' + user._id })
    }

    handlesGroupClick = (user, event) => {
        const { router } = this.context
        router.push({ pathname: '/users/' + user._id })
    }
}

Users.propTypes = {
    currentView: PropTypes.string.isRequired,
    enterUsers: PropTypes.func.isRequired,
    leaveUsers: PropTypes.func.isRequired
  }

Users.contextTypes = {
    router: PropTypes.object
}

export default Users
