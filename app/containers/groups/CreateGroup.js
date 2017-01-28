import gql from 'graphql-tag'
import { CreateGroup } from '../../views'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { bindActionCreators } from 'redux'
import * as viewsActions from '../../redux/modules/views'

/* -----------------------------------------
  GraphQL - Apollo client
 ------------------------------------------*/
 // infoLinkText,
 // img,
 // createdBy
 const createGroupMutation = gql `
     mutation createGroup($group: GroupInput!) {
         createGroup(group: $group) {
             name
         }
     }
 `

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

 const CreateGroupWithMutation = graphql(createGroupMutation)(CreateGroup)

//
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
        groups {
            _id,
            name,
            description
        }
    }
 `
 // infoLinkText,
 // img,
 // createdBy

// 1- add queries:
const GroupsWithQuery = graphql(UserQuery, {
    props: ({ data: { loading, users } }) => ({
        users,
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
  graphql(createGroupMutation, {name: 'CreateGroupWithMutation'})
(CreateGroup)))
// const LandscapesWithQuery = graphql(LandscapeQuery, {
//     props: ({ data: { loading, landscapes, groups } }) => ({
//         landscapes,
//         groups,
//         loading
//     })
// })(CreateGroup)

//
// const NewEntryWithData =  graphql(LandscapeQuery, {props: ({ data: { loading, landscapes, groups } }) => ({
//     landscapes,
//     groups,
//     loading
// })})(graphql(UserQuery, {
//     props: ({ data: { loading, users } }) => ({
//         users,
//         loading
//     })
// }))(
//   graphql(createGroupMutation, {name: 'CreateGroupWithMutation'})(CreateGroup)
// )
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
