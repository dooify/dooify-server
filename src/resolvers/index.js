import query from '../query'
import {findOne} from './commonTasks'
import { GraphQLScalarType } from 'graphql'
import getBalance from '../business/getBalance'

export default {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'A Date in ISO format',
        serialize(value) {
            console.log(value)
            let result = value && value.toISOString()
            return result
        },
        parseValue(value) {
            let result = new Date(value)
            return result
        },
        parseLiteral(ast) {
            switch (ast.kind) {
            }
            return null
        }
    }),

    Query: {
        recommendations: () => new Promise( (resolve, reject) => {

            query("SELECT id FROM ads ORDER BY random() LIMIT 8")
                .then( (ads) => {

                    const recommendations = ads.map( (ad) => {
                        return {
                            id: ad.id,
                            adId: ad.id,
                        }
                    })

                    resolve(recommendations)
                })
                .catch( (err) => {
                    reject(err)
                })
        }),

        ad: (root, {id}) =>
            query("SELECT * FROM ads WHERE id = $1", id).first(),

        profile: (root, {userId}) =>
            query("SELECT * FROM profiles WHERE userId = $1", userId).first(),

        userStatus: (o, a, {user}) => {
            return getBalance(user.id)
                .then( (balance) => {
                    console.log('=============')
                    console.log(balance)
                    return {
                        balance,
                    }
                })
        }
    },

    Recommendation: {
        ad: findOne('ads.id == adId')
    },

    Ad: {
        user: findOne('users.id == userId')
    },

    User: {
        profile: findOne('profiles.userId == id')
    }
}
