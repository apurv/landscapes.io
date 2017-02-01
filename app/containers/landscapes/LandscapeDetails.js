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

let tempId

const DeploymentsWithQuery = graphql(DeploymentByLandscapeIdQuery, {
    props: ({ data: { loading, deploymentsByLandscapeId } }) => ({
        loading,
        deploymentsByLandscapeId,
        passLandscape(landscapeId) {
            tempId = landscapeId
        },
        landscapeId: tempId
    })
})

const composedRequest = compose(
    LandscapesWithQuery,
    DeploymentsWithQuery
)(LandscapeDetails)


/* -----------------------------------------
  Redux
 ------------------------------------------*/
// TODO: figure out how to do this properly
const mapStateToProps = state => {
    return {
        currentView: state.views.currentView,
        landscapeId: tempId
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        enterLandscapes: viewsActions.enterLandscapes,
        leaveLandscapes: viewsActions.leaveLandscapes
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(composedRequest)
