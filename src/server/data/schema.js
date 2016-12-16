// schema.js
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'

import User from './types/user.js'
import Landscape from './types/landscape.js'
import Subscription from './types/subscriptions.js'

const Query = `
    type Query {
        landscapes: [Landscape]
    }
`

const Mutation = `
    type Mutation {
        upvotePost ( postId: Int! ): Landscape
    }
`

export default makeExecutableSchema({
    typeDefs: [ Query, User, Mutation, Landscape, Subscription ],
    resolvers,
})
