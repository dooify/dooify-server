import session from 'express-session'
const PgSimple = require('connect-pg-simple')

export default function s(app) {
    const sess = {
        store: new (PgSimple(session))(),
        secret: process.env.COOKIE_SECRET || 'fjil4354yGEF#@Y%$Y233',
        maxAge: 365*24*60*60*1000,
        resave: false,
        saveUninitialized: false,
    }

    if (app.get('env') === 'production') {
        app.set('trust proxy', 1)
        sess.cookie.secure = true
    }

    app.use(session(sess))
}
