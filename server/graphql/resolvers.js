import passport from 'passport'
import { find, filter } from 'lodash'
import { pubsub } from './subscriptions'
const Landscape = require('./models/landscape')
const Group = require('./models/group')
const Account = require('./models/account')
const User = require('../auth/models/user.server.model')


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
        ,
        groups() {
            return Group.find().sort('-created').populate('user', 'displayName').exec((err, groups) => {
                console.log('groups ---', groups)
                if (err) return err
                return groups
            })
            // return groups.retrieve()
        },
        users() {
            return User.find().sort('-created').populate('user', 'displayName').exec((err, groups) => {
                console.log('groups ---', groups)
                if (err) return err
                return groups
            })
            // return groups.retrieve()
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
        createUser(_, { user }) {

            console.log(' ---> creating User')
            let newUser = new User(user)

            newUser.save(err => {
                if (err) {
                    console.log(err)
                    return err
                } else {
                    console.log(' ---> created: ', newUser._id)
                    return newUser
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
        ,
        createGroup(_, { group }) {
            console.log('inside resolver to create group', group)

            console.log(' ---> creating group')

            let newGroup = new Group(group)

            newGroup.save(err => {
                if (err) {
                    console.log(err)
                    return err
                } else {
                    console.log(' ---> created: ' + newGroup._id)
                    return Group.find(newGroup._id).sort('-created').populate('user', 'displayName').exec((err, landscapes) => {
                        if (err) return err
                        return landscapes
                    })
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
        // posts(author) {
        //     return filter(posts, { authorId: author.id })
        // }
    },
    Landscape: {
        // author(post) {
        //     return find(authors, { id: post.authorId })
        // }
    }
}

export default resolveFunctions
