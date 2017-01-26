import passport from 'passport'
import { find, filter } from 'lodash'
import { pubsub } from './subscriptions'

// model imports
const Landscape = require('./models/landscape')

const resolveFunctions = {
    Query: {
        landscapes() {
            return Landscape.find().sort('-created').populate('user', 'displayName').exec((err, landscapes) => {
                if (err) return err
                return landscapes
            })
        }
    },
    Mutation: {
        loginUser(_, { user }) {
            console.log('login resolver')
        },
        createLandscape(_, { landscape }) {
            console.log('inside resolver to create landscape', landscape)

            console.log(' ---> creating Landscape')

            let newLandscape = new Landscape(landscape)

            newLandscape.save(err => {
                if (err) {
                    console.log(err)
                    return err
                } else {
                    console.log(' ---> created: ' + newLandscape._id)
                    // res.json(newLandscape)
                }
            })
        }
    },
    Subscription: {
        postUpvoted(post) {
            return post
        }
    },
    User: {
        posts(author) {
            return filter(posts, { authorId: author.id })
        }
    },
    Landscape: {
        // author(post) {
        //     return find(authors, { id: post.authorId })
        // }
    }
}

export default resolveFunctions
