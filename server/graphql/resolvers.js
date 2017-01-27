import passport from 'passport'
import { find, filter } from 'lodash'
import { pubsub } from './subscriptions'
const Landscape = require('./models/landscape')
const Group = require('./models/group')
const Account = require('./models/account')
const User = require('./models/user')


const resolveFunctions = {
    Query: {
        landscapes() {
            return Landscape.find().sort('-created').populate('user', 'displayName').exec((err, landscapes) => {
                if (err) return err
                return landscapes
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
