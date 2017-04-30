import q from '../query'

export default function getBalance(userId) {
    return q(`SELECT id FROM users WHERE id = $1`, userId)
        .then( (users) => {
            if (users.length == 0) {
                return null
            }

            const ret = calculateBalance(userId)
            console.log(ret)
            return ret
        })
}

function calculateBalance(userId) {
    return Promise.all([
        q(`
            SELECT hours
            FROM bookingDeal
            WHERE bookingId IN (
                SELECT id
                FROM bookings
                WHERE sellerUserId = $1
            )
        `, userId),

        q(`
            SELECT hours
            FROM bookingDeal
            WHERE bookingId IN (
                SELECT id
                FROM bookings
                WHERE buyerUserId = $1
            )
        `, userId),

        q(`
            SELECT hours
            FROM bonuses
            WHERE userId = $1
        `, userId),

        q(`
            SELECT 1
            FROM referrals
            WHERE vitoUserId = $1
        `, userId),

        q(`
            SELECT 1
            FROM referrals
            WHERE lucaUserId = $1
        `, userId),
    ])
        .then( ([hoursSold, hoursBought, bonuses, vitos, lucas]) => {
            let balance =
                hoursSold.reduce((o,t)=>o+parseInt(t), 0) -
                hoursBought.reduce((o,t)=>o+parseInt(t), 0) +
                bonuses.reduce((o,t)=>o+parseInt(t), 0) +
                vitos.length +
                lucas.length
            return balance
        })
}
