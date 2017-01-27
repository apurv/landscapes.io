import gql from 'graphql-tag'
import { EditGroup } from '../../views'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { bindActionCreators } from 'redux'
import * as viewsActions from '../../redux/modules/views'

/* -----------------------------------------
  GraphQL - Apollo client
 ------------------------------------------*/

 const GroupQuery = gql `
     query getGroups {
         groups {
           _id,
           users,
           landscapes,
           permissions,
           createdAt,
           name,
           description,
         }
     }
  `

 // 1- add queries:
 const EditGroupWithQuery = graphql(GroupQuery, {
     props: ({ data: { loading, groups } }) => ({
         groups,
         loading
     })
 })(EditGroup)

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

export default connect(mapStateToProps, mapDispatchToProps)(EditGroupWithQuery)
