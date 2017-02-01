import gql from 'graphql-tag'
import { Landscapes } from '../../views'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { bindActionCreators } from 'redux'
import * as viewsActions from '../../redux/modules/views'

/* -----------------------------------------
  GraphQL - Apollo client
 ------------------------------------------*/
 const UserQuery = gql `
     query getUsers {
         users {
             _id,
             username,
             email,
             firstName,
             lastName,
             password,
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
              },
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
            infoLinkText,
            createdAt,
            description,
            cloudFormationTemplate
        }
    }
 `
 // img,
 // createdBy

// 1- add queries:
const LandscapesWithQuery = graphql(LandscapeQuery, {
    props: ({ data: { loading, landscapes } }) => ({
        landscapes,
        loading
    })
})(graphql(UserQuery, {
    props: ({ data: { loading, users } }) => ({
        users,
        loading
    })
})(graphql(GroupQuery, {
    props: ({ data: { loading, groups, refetch } }) => ({
        groups,
        loading,
        refetchGroups: refetch
    })
})(Landscapes)))


/* -----------------------------------------
  Redux
 ------------------------------------------*/

const mapStateToProps = state => {
    return { currentView: state.views.currentView }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        enterLandscapes: viewsActions.enterLandscapes,
        leaveLandscapes: viewsActions.leaveLandscapes
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LandscapesWithQuery)
