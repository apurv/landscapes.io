import gql from 'graphql-tag'
import { GroupDetails } from '../../views'
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
 // infoLinkText,
 // img,
 // createdBy

// 1- add queries:
const GroupsWithQuery = graphql(GroupQuery, {
    props: ({ data: { loading, groups } }) => ({
        groups,
        loading
    })
})(GroupDetails)


/* -----------------------------------------
  Redux
 ------------------------------------------*/

const mapStateToProps = state => {
    return { currentView: state.views.currentView }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        enterGroupDetails: viewsActions.enterGroupDetails,
        leaveGroupDetails: viewsActions.leaveGroupDetails
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupsWithQuery)
