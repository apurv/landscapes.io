// schema.js
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'

import User from './types/user.js'
import Account from './types/account.js'
import Landscape from './types/landscape.js'
import Subscription from './types/subscriptions.js'

// user
// parentLandscapeId: { type: Schema.ObjectId, ref: 'Landscape' },
// createdAt: { type: Date, default: Date.now },
// createdBy: { type: Schema.ObjectId, ref: 'User' },
// img: { data: Buffer, contentType: String },

// Account
// createdBy: User
const Query = `
    input LoginInput {
        username: String
        password: String
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

    type Query {
        accounts: [Account]
        landscapes: [Landscape]
    }
`

const Mutation = `
    type Mutation {
        loginUser ( user: LoginInput! ): User
        createAccount ( account: AccountInput! ): Account
        updateAccount ( account: AccountInput! ): Account
        deleteAccount ( account: AccountInput! ): Account
        createLandscape ( landscape: LandscapeInput! ): Landscape
        updateLandscape ( landscape: LandscapeInput! ): Landscape
        deleteLandscape ( landscape: LandscapeInput! ): Landscape
    }
`

export default makeExecutableSchema({
    typeDefs: [ Query, User, Mutation, Landscape, Account, Subscription ],
    resolvers,
})
