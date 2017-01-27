import passport from 'passport'
import { find, filter } from 'lodash'
import { pubsub } from './subscriptions'
const Landscape = require('./models/landscape')
const Group = require('./models/group')

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
