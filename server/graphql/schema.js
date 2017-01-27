// schema.js
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'

import User from './types/user.js'
import Landscape from './types/landscape.js'
import Group from './types/group.js'
import Subscription from './types/subscriptions.js'
// parentLandscapeId: { type: Schema.ObjectId, ref: 'Landscape' },
// createdAt: { type: Date, default: Date.now },
// createdBy: { type: Schema.ObjectId, ref: 'User' },
// img: { data: Buffer, contentType: String },
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

    input GroupInput {
      landscapes: [String]
      users: [String]
      permissions: [String]

      name: String
      description: String

    }

    type Query {
        landscapes: [Landscape],
        groups: [Group]
    }
`

const Mutation = `
    type Mutation {
        loginUser ( user: LoginInput! ): User
        createLandscape ( landscape: LandscapeInput! ): Landscape
        createGroup ( group: GroupInput! ): Group
    }
`

export default makeExecutableSchema({
    typeDefs: [ Query, User, Group, Mutation, Landscape, userObject, Subscription ],
    resolvers,
})
