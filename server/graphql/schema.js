// schema.js
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'

import User from './types/user.js'
import Account from './types/account.js'
import Landscape from './types/landscape.js'
import Group from './types/group.js'
import Subscription from './types/subscriptions.js'

const userObject = `
    type userObject {
        userId: String!,
        isAdmin: Boolean!
    }
`

const Query = `
    input LoginInput {
        username: String
        password: String
    }

    input UserInput {
        _id: String
        username: String
        email: String
        password: String
        firstName: String
        lastName: String
    }

    input AccountInput {
        _id: String
        __typename: String
        name: String
        createdAt: String
        endpoint: String
        caBundlePath: String
        rejectUnauthorizedSsl: Boolean
        signatureBlock: String
        region: String
        isOtherRegion: Boolean
        accessKeyId: String
        secretAccessKey: String
    }

    input LandscapeInput {
        _id: String
        __typename: String
        name: String
        version: String
        imageUri: String
        img: String
        infoLink: String
        infoLinkText: String
        description: String
        cloudFormationTemplate: String
    }

    input GroupInput {
      landscapes: [String]
      users: [String]
      permissions: [String]

      name: String
      description: String

    }

    type Query {
        groups: [Group]
        accounts: [Account]
        landscapes: [Landscape]
        users: [User]
    }
`

const Mutation = `
    type Mutation {
        loginUser ( user: LoginInput! ): User
        createUser ( user: UserInput! ): User
        createGroup ( group: GroupInput! ): Group
        editGroup ( group: GroupInput! ): Group
        createAccount ( account: AccountInput! ): Account
        updateAccount ( account: AccountInput! ): Account
        deleteAccount ( account: AccountInput! ): Account
        createLandscape ( landscape: LandscapeInput! ): Landscape
        updateLandscape ( landscape: LandscapeInput! ): Landscape
        deleteLandscape ( landscape: LandscapeInput! ): Landscape
    }
`

export default makeExecutableSchema({
    typeDefs: [ Query, User, Group, Mutation, Landscape, Account, Subscription ],
    resolvers,
})
