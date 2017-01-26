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
        createLandscape ( landscape: LandscapeInput! ): Landscape
        editLandscape ( landscape: LandscapeInput! ): Landscape
        createAccount ( account: AccountInput! ): Account
    }
`

export default makeExecutableSchema({
    typeDefs: [ Query, User, Mutation, Landscape, Account, Subscription ],
    resolvers,
})
