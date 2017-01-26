// schema.js
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'

import User from './types/user.js'
import Landscape from './types/landscape.js'
import Subscription from './types/subscriptions.js'

// parentLandscapeId: { type: Schema.ObjectId, ref: 'Landscape' },
// createdAt: { type: Date, default: Date.now },
// createdBy: { type: Schema.ObjectId, ref: 'User' },
// img: { data: Buffer, contentType: String },

const Query = `
    input LoginInput {
        username: String
        password: String
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
        landscapes: [Landscape]
    }
`

const Mutation = `
    type Mutation {
        loginUser ( user: LoginInput! ): User
        createLandscape ( landscape: LandscapeInput! ): Landscape
    }
`

export default makeExecutableSchema({
    typeDefs: [ Query, User, Mutation, Landscape, Subscription ],
    resolvers,
})
