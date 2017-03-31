import query from '../query'

export default {
    Query: {

        recommendations: () => new Promise( (resolve, reject) => {

            query("SELECT id FROM ads")
                .then( (ads) => {
                    const picked = {}
                    const recommendations = []
                    let target = 8
                    if (ads.length < target) {
                        target = Math.ceil(ads.length / 2)
                    }

                    while (target > 0) {
                        target -= 1

                        let ad = ads[Math.floor(Math.random()*ads.length)]

                        while(picked[ad.id]) {
                            ad = ads[Math.floor(Math.random()*ads.length)]
                        }

                        picked[ad.id] = true

                        recommendations.push({
                            id: ad.id,
                            adId: ad.id,
                        })
                    }

                    resolve(recommendations)
                })
                .catch( (err) => {
                    reject(err)
                })
        }),

    },

    Recommendation: {
        ad: ({adId}) => new Promise( (resolve, reject) => {

            query("SELECT * FROM ads WHERE id = $1 LIMIT 1", adId)
                .then( (rows) =>
                    resolve(rows[0])
                )
                .catch( (err) =>
                    reject(err)
                )

        }),
    }
}
