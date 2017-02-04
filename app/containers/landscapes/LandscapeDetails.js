import gql from 'graphql-tag'
import { connect } from 'react-redux'
import { compose, graphql } from 'react-apollo'
import { bindActionCreators } from 'redux'
import { LandscapeDetails } from '../../views'
import * as viewsActions from '../../redux/modules/views'

/* -----------------------------------------
  GraphQL - Apollo client
 ------------------------------------------*/

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

const DeploymentByLandscapeIdQuery = gql `
    query getDeploymentsByLandscapeId($landscapeId: String) {
        deploymentsByLandscapeId(landscapeId: $landscapeId) {
            _id,
            createdAt,
            stackName,
            accountName,
            landscapeId,
            isDeleted,
            description,
            location,
            billingCode,
            flavor,
            cloudFormationTemplate,
            cloudFormationParameters,
            tags,
            notes,
            stackId,
            stackStatus,
            stackLastUpdate,
            awsErrors
        }
    }
 `

// 1- add queries:
const LandscapesWithQuery = graphql(LandscapeQuery, {
    props: ({ data: { loading, landscapes } }) => ({
        landscapes,
        loading
    })
})

const deleteDeploymentMutation = gql `
    mutation deleteDeployment($deployment: DeploymentInput!) {
        deleteDeployment(deployment: $deployment) {
            stackName
        }
    }
`

const DeploymentByLandscapeIdMutation = gql `
    mutation getDeploymentsByLandscapeId($landscapeId: String!) {
        deploymentsByLandscapeId(landscapeId: $landscapeId) {
            _id,
            createdAt,
            stackName,
            accountName,
            landscapeId,
            isDeleted,
            description,
            location,
            billingCode,
            flavor,
            cloudFormationTemplate,
            cloudFormationParameters,
            tags,
            notes,
            stackId,
            stackStatus,
            stackLastUpdate,
            awsErrors
        }
    }
`

const composedRequest = compose(
    LandscapesWithQuery,
    graphql(deleteDeploymentMutation),
    graphql(DeploymentByLandscapeIdMutation, { name: 'deploymentsByLandscapeId' })
)(LandscapeDetails)


/* -----------------------------------------
  Redux
 ------------------------------------------*/
const mapStateToProps = state => {
    return { currentView: state.views.currentView }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        enterLandscapes: viewsActions.enterLandscapes,
        leaveLandscapes: viewsActions.leaveLandscapes
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(composedRequest)
