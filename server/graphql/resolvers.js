import passport from 'passport'
import { find, filter } from 'lodash'
import { pubsub } from './subscriptions'

// model imports
const Landscape = require('./models/landscape')
const Account = require('./models/account')

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

            console.log(' ---> creating Landscape')
            let newLandscape = new Landscape(landscape)

            newLandscape.save(err => {
                if (err) {
                    console.log(err)
                    return err
                } else {
                    console.log(' ---> created: ' + newLandscape._id)
                    return newLandscape
                }
            })
        },
        editLandscape(_, { landscape }) {

            console.log(' ---> editing Landscape')
            let editedLandscape = new Landscape(landscape)

            editedLandscape.save(err => {
                if (err) {
                    console.log(err)
                    return err
                } else {
                    console.log(' ---> created: ' + editedLandscape._id)
                    return editedLandscape
                }
            })
        },
        createAccount(_, { account }) {

            console.log(' ---> creating Account')
            let newAccount = new Account(account)

            newAccount.save(err => {
                if (err) {
                    console.log(err)
                    return err
                } else {
                    console.log(' ---> created: ' + newAccount._id)
                    return newAccount
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
