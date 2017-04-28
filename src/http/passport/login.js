import passport from 'passport'
import LocalStrategy from 'passport-local'
import query from '../../query'
import bcrypt from 'bcrypt'

passport.use(new LocalStrategy(
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
                                id: user.id,
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
    app.post(
        '/login',
        passport.authenticate(
            'local',
            {
                successRedirect: '/',
                failureRedirect: '/login',
            }
        )
    )

}
