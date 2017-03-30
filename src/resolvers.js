import Plan from './plan'
import c from './business/commonTasks'
import Ad from './db/ad'

export default {
    Query: {

        recommendations: () => new Promise( (resolve, reject) => {
            const ads = []
            const picked = {}

            Plan(
                c.findAll('ad'),
                ({ad}, cb) => {
                    ads.push(ad)
                },
            )({}).then( () => {

                const recommendations = []
                let target = 8
                if (ads.length < target) {
                    target = Math.ceil(ads.length / 2)
                }

                while (target > 0) {
                    target -= 1

                    let ad = ads[Math.floor(Math.random()*ads.length)]

                    while(picked[ad.get('id')]) {
                        ad = ads[Math.floor(Math.random()*ads.length)]
                    }

                    picked[ad.get('id')] = true

                    recommendations.push({
                        id: ad.get('id'),
                        adId: ad.get('id'),
                    })
                }

                resolve(recommendations)
            })
        }),

    },

    Recommendation: {
        ad: ({adId}) => new Promise( (resolve, reject) => {

            Ad.find(adId, (ad) => {
                ad = ad.dump()
                console.log(ad)
                resolve(ad)
            })
        }),
    }
}
