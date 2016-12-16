import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import { createServer } from 'http'
import { printSchema } from 'graphql/utilities/schemaPrinter'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'

import schema from './data/schema'
import { subscriptionManager } from './data/subscriptions'

const GRAPHQL_PORT = 8080
const WS_PORT = 8090

const graphQLServer = express().use('*', cors())

mongoose.connect('mongodb://localhost/landscapes-dev')

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({
    schema,
    context: {},
}))

graphQLServer.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
}))

graphQLServer.use('/schema', (req, res) => {
    res.set('Content-Type', 'text/plain')
    res.send(printSchema(schema))
})

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
))

// WebSocket server for subscriptions
const websocketServer = createServer((request, response) => {
    response.writeHead(404)
    response.end()
})

websocketServer.listen(WS_PORT, () => console.log( // eslint-disable-line no-console
    `Websocket Server is now running on http://localhost:${WS_PORT}`
))

// eslint-disable-next-line
new SubscriptionServer(
    { subscriptionManager },
    websocketServer
)
