import gql from 'graphql-tag'
import { About } from '../../views'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { bindActionCreators } from 'redux'
import * as viewsActions from '../../redux/modules/views'

/* -----------------------------------------
  GraphQL - Apollo client
 ------------------------------------------*/

const LandscapeQuery = gql `
    query getLandscapes {
        landscapes {
            name,
            version,
            cloudFormationTemplate
        }
    }
 `

// 1- add queries:
const LandscapesWithQuery = graphql(LandscapeQuery, {
    props: ({ data: { loading, landscapes } }) => ({
        landscapes,
        loading
    })
})(About)


/* -----------------------------------------
  Redux
 ------------------------------------------*/

const mapStateToProps = state => {
    return { currentView: state.views.currentView }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        enterAbout: viewsActions.enterAbout,
        leaveAbout: viewsActions.leaveAbout
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LandscapesWithQuery)
