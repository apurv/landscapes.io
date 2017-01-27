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
        },
        accounts() {
            return Account.find().sort('-created').exec((err, accounts) => {
                if (err) return err
                return accounts
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
                    console.log(' ---> created: ', newLandscape._id)
                    return newLandscape
                }
            })
        },
        updateLandscape(_, { landscape }) {

            console.log(' ---> updating Landscape')

            Landscape.findOneAndUpdate({ _id: landscape._id }, landscape, { new: true }, (err, doc) => {
                if (err) {
                    console.log(err)
                    return err
                } else {
                    console.log(' ---> updated: ', doc)
                    return doc
                }
            })
        },
        deleteLandscape(_, { landscape }) {

            console.log(' ---> deleting Landscape')

            Landscape.findByIdAndRemove(landscape._id, (err, doc) => {
                if (err) {
                    console.log('error', err)
                    return err
                } else {
                    console.log(' ---> Account deleted: ', doc)
                    return doc
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
                    console.log(' ---> created: ', newAccount._id)
                    return newAccount
                }
            })
        },
        updateAccount(_, { account }) {

            console.log(' ---> updating Account')

            Account.findOneAndUpdate({ _id: account._id }, account, { new: true }, (err, doc) => {
                if (err) {
                    console.log(err)
                    return err
                } else {
                    console.log(' ---> updated: ', doc)
                    return doc
                }
            })
        },
        deleteAccount(_, { account }) {

            console.log(' ---> deleting Account')

            Account.findByIdAndRemove(account._id, (err, doc) => {
                if (err) {
                    console.log('error', err)
                    return err
                } else {
                    console.log(' ---> Account deleted: ', doc)
                    return doc
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
