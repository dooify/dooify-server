import express from 'express'
import cors from './cors'
import session from './session'
import graphql from './graphql'
import images from './images'
import passport from './passport'

const app = express()

cors(app)
session(app)
graphql(app)
images(app)

app.listen(8080)
