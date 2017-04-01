import query from '../query'
import {findOne} from './commonTasks'
import { GraphQLScalarType } from 'graphql'

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
