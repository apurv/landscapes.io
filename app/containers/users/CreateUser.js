import gql from 'graphql-tag'
import { CreateUser } from '../../views'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { bindActionCreators } from 'redux'
import * as viewsActions from '../../redux/modules/views'

/* -----------------------------------------
  GraphQL - Apollo client
 ------------------------------------------*/


 const CreateNewUser = gql `
     mutation CreateNewUser($user: UserInput!) {
         createUser(user: $user) {
             username
             password
             email
             firstName
             lastName
         }
     }
 `

 // 1- add queries:

 // 2- add mutation "logUser":

const UserQuery = gql `
    query getUsers {
        users {
          _id,
          username,
          email,
          firstName,
          lastName,
          role
        }
    }
 `
 // infoLinkText,
 // img,
 // createdBy

// 1- add queries:
const GroupsWithQueryAndMutation = graphql(UserQuery, {
    props: ({ data: { loading, users } }) => ({
        users,
        loading
    })
})(graphql(CreateNewUser, {
    name: 'CreateUserMutation'})
(CreateUser))


/* -----------------------------------------
  Redux
 ------------------------------------------*/

const mapStateToProps = state => {
    return { currentView: state.views.currentView }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        enterUsers: viewsActions.enterUsers,
        leaveUsers: viewsActions.leaveUsers
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupsWithQueryAndMutation)
