// schema.js
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'

import User from './types/user.js'
import Landscape from './types/landscape.js'
import Subscription from './types/subscriptions.js'

const Query = `
    input LoginInput {
        username: String
        password: String
    }

    type Query {
        landscapes: [Landscape]
    }
`

const Mutation = `
    type Mutation {
        loginUser ( user: LoginInput! ): User
    }
`

export default makeExecutableSchema({
    typeDefs: [ Query, User, Mutation, Landscape, Subscription ],
    resolvers,
})
