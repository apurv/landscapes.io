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
     mutation createGroup($group: GroupInput!) {
         createGroup(group: $group) {
             name
         }
     }
 `

 // const CreateGroupWithMutation = graphql(editGroupMutation)(CreateGroup)


 const GroupQuery = gql `
     query getGroups {
         groups {
             _id,
             name,
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
     props: ({ data: { loading, groups } }) => ({
         groups,
         loading
     })
 })
 (graphql(LandscapeQuery, {
     props: ({ data: { loading, landscapes } }) => ({
         landscapes,
         loading
     })
   }
 )
 (
   graphql(editGroupMutation, {name: 'EditGroupWithMutation'})
 (EditGroup)))

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