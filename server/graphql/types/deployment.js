// deployment.js
import User from './user'

const Deployment = `
    type Deployment {
        _id: String!
        createdAt: String
        createdBy: User
        stackName: String
        accountName: String
        landscapeId: String
        isDeleted: Boolean
        description: String
        location: String
        billingCode: String
        flavor: String
        cloudFormationTemplate: String
        cloudFormationParameters: [String]
        tags: [String]
        notes: [String]
        stackId: String
        stackStatus: String
        stackLastUpdate: String
        awsErrors: String
    }
`

export default() => [Deployment, User]
