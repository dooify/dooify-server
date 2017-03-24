import 'source-map-support/register'
import 'babel-polyfill'
import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import { makeExecutableSchema } from 'graphql-tools'

import resolvers from './resolvers'
import schema from './schema'

const app = express()

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
})

app.post('/graphql',
  bodyParser.json(),
  graphqlExpress(() => ({
    schema: executableSchema,
  }))
)

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}))

app.listen(8080)
