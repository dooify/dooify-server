import passport from 'passport'
import Strategy from 'passport-json'
import query from '../../query'
import bcrypt from 'bcrypt'
import bodyParser from 'body-parser'

passport.use(new Strategy(
    function(username, password, done) {
        query(`
            SELECT userId, password
            FROM logins
            WHERE name = $1
            LIMIT 1
        `, username)
            .then( (users) => {
                if (users.length == 0) {
                    return done(
                        null,
                        false,
                        {
                            message: 'Incorrect username.'
                        }
                    )
                } else {
                    const user = users[0]
                    if (bcrypt.compareSync(password, user.password)) {
                        return done(
                            null,
                            {
                                id: user.userId,
                            }
                        )
                    } else {
                        return done(
                            null,
                            false,
                            {
                                message: 'Incorrect password.',
                            }
                        )
                    }
                }
            })
            .catch( (err) => {
                return done(err)
            })
    }
))

export default function c(app) {
    app.get(
        '/login',
        (req, res) => {
            const fail = () => { res.json({error: 'not logged in'}) }
            const {passport} = req.session

            if (!passport) {
                fail()
                return
            }
            const {user} = req.session.passport

            if (!user) {
                fail()
                return
            }

            query(`
                SELECT id
                FROM users
                WHERE id = $1
                LIMIT 1
            `, user.id)
                .then( (users) => {
                    if (users.length == 0) {
                        fail()
                    } else {
                        res.json({
                            user: {
                                id: user.id,
                            }
                        })
                    }
                })
        }
    )

    app.post(
        '/login',
        bodyParser.json(),
        passport.authenticate('json'),
        (req, res) => {
            res.json({user: req.user})
        }
    )

    app.post(
        '/logout',
        (req, res) => {
            req.session.destroy(function(err) {
                if (err) {
                    res.status(500)
                    res.json(err)
                } else {
                    res.json({ message: 'Logged out successfully' })
                }
            })
        }
    )
}
