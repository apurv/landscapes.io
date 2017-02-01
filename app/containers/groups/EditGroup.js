import gql from 'graphql-tag'
import { EditGroup } from '../../views'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { bindActionCreators } from 'redux'
import * as viewsActions from '../../redux/modules/views'

/* -----------------------------------------
  GraphQL - Apollo client
 ------------------------------------------*/
 const editGroupMutation = gql `
     mutation updateGroup($group: GroupInput!) {
         updateGroup(group: $group) {
             name
         }
     }
 `

 // const CreateGroupWithMutation = graphql(editGroupMutation)(CreateGroup)
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

 const GroupQuery = gql `
     query getGroups {
         groups {
             _id,
             name,
             users{
               isAdmin,
               userId
             }
             description,
             landscapes,
             permissions
         }
     }
  `

 const LandscapeQuery = gql `
     query getLandscapes {
       landscapes {
           _id,
           name,
           version,
           imageUri,
           infoLink,
           createdAt,
           description,
           cloudFormationTemplate
       }
     }
  `
 // 1- add queries:
 const GroupsWithQuery = graphql(GroupQuery, {
     props: ({ data: { loading, groups, refetch } }) => ({
         groups,
         loading,
         refetchGroups: refetch
     })
 })
 (graphql(LandscapeQuery, {
     props: ({ data: { loading, landscapes } }) => ({
         landscapes,
         loading
     })
   }
 )
 (graphql(UserQuery, {
     props: ({ data: { loading, users } }) => ({
         users,
         loading
     })
   }
 )
 (
   graphql(editGroupMutation, {name: 'EditGroupWithMutation'})
 (EditGroup))))

/* -----------------------------------------
  Redux
 ------------------------------------------*/

const mapStateToProps = state => {
    return { currentView: state.views.currentView }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        enterGroups: viewsActions.enterGroups,
        leaveGroups: viewsActions.leaveGroups
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupsWithQuery)
