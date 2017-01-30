import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { bindActionCreators } from 'redux'
import { CreateDeployment } from '../../views'
import * as viewsActions from '../../redux/modules/views'

/* -----------------------------------------
  GraphQL - Apollo client
 ------------------------------------------*/

const AccountsQuery = gql `
    query getAccounts {
        accounts {
            _id,
            name,
            region,
            createdAt,
            endpoint,
            caBundlePath,
            rejectUnauthorizedSsl,
            signatureBlock,
            isOtherRegion,
            accessKeyId,
            secretAccessKey
        }
    }
 `
 // createdBy

const AccountsWithQuery = graphql(AccountsQuery, {
    props: ({ data: { loading, accounts } }) => ({
        accounts,
        loading
    })
})

const createDeploymentMutation = gql `
    mutation createDeployment($deployment: DeploymentInput!) {
        createDeployment(deployment: $deployment) {
            name
        }
    }
`

const composedRequest = compose(
    AccountsWithQuery,
    graphql(createDeploymentMutation)
)(CreateDeployment)


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

export default connect(mapStateToProps, mapDispatchToProps)(composedRequest)
