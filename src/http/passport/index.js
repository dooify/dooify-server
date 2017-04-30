import passport from 'passport'
import login from './login'

export default function c(app) {
    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser(function(user, done) {
        done(null, user)
    })

    passport.deserializeUser(function(user, done) {
        done(null, user)
    })

    login(app)
}
