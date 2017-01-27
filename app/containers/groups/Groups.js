import gql from 'graphql-tag'
import { Groups } from '../../views'
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
            description
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
})(Groups)


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
