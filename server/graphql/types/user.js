// author.js
import Landscape from './landscape'

const User = `
    type User {
        id: Int # the ! means that every author object _must_ have an id
        username: String!
        password: String!
        firstName: String
        lastName: String
        posts: [Landscape] # the list of Landscapes by this author
    }
`

// we export User and all types it depends on
// in order to make sure we don't forget to include
// a dependency
export default() => [User, Landscape]
