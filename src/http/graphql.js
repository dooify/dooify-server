import {makeExecutableSchema} from 'graphql-tools'
import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import bodyParser from 'body-parser'
import resolvers from '../resolvers'
import schema from '../schema'

export default function c(app) {
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
}
