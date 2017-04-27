import 'source-map-support/register'
import 'babel-polyfill'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'
import schema from './schema'

const app = express()
app.use(cors())

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


import getImage from './business/get_image'

app.get('/images/:id/:width', (req, res) => {
    const {id} = req.params
    const width = parseInt(req.params.width)
    if (![100, 240, 360, 750].includes(width)) {
        res.status(404)
        res.end()
    }
    getImage({width, id})
        .then( (image) => {
            const [_, type, base64] = image.image.match(
                /^data:(image\/[a-z]+);base64,(.*)$/
            )
            if (type) {
                res.setHeader('Content-Type', type)
                res.setHeader('Date', image.createdAt)
                res.setHeader('Last-Modified', image.createdAt)
                res.setHeader('Cache-Control', 'max-age=31536000, max-stale=31536000, public')
                res.send(Buffer.from(base64, 'base64'))
            } else {
                res.status('500')
            }

            res.end()
        })
        .catch( (err, two) => {
            console.log(err)
            res.status(status(err))
            res.json(err)
            res.end()
        })
})

const status = (answer) => {
    switch(answer.error) {
        case 'validation':
            return 400
        case 'duplicate':
        case 'mail exists':
        case 'frozen':
        case 'forbidden':
            return 403
        case  'invalid session':
        case 'login failed':
        case 'unauthorized':
            return 401
        case 'does not exist':
            return 404
        case !undefined:
            return 500
        default:
            return 200
    }
}

const send = (res, answer) => {
    res.status(status(answer))

    if (answer.error) {
        res.json(answer)
    } else {
        const {image} = answer
        const data = image.image.match(/^data:(image\/[a-z]+);base64,(.*)$/)
        if (data) {
            if (!image.createdAt) {
                delete image.image
                throw Error('oopa')
            }
            res.setHeader('Content-Type', data[1])
            res.setHeader('Date', image.createdAt)
            res.setHeader('Last-Modified', image.createdAt)
            res.setHeader('Cache-Control', 'max-age=31536000, max-stale=31536000, public')
            res.send(Buffer.from(data[2], 'base64'))
        } else {
            res.status('500')
        }
    }

    res.end()
}

app.listen(8080)
