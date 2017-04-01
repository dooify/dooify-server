import query from '../query'
import parse from './parse'

export function findById(table, id) {
    return new Promise( (resolve, reject) => {
        query(`SELECT * FROM "${table}" WHERE id = $1 LIMIT 1`, id)
            .then( (rows) => {
                if (rows.length > 0) {
                    resolve(rows[0])
                } else {
                    reject(`Could not find the ID '${id}' in '${table}'`)
                }
            })
            .catch( (err) => {
                reject(err)
            })

    })
}

export function findOne(expr) {
    const q = parse(expr)
    const {constraintName, constraintColumn} = q
    const {targetName, targetColumn} = q

    return (obj) => {
        return new Promise( (resolve, reject) => {
            const constraint = obj[constraintName]
            query(`SELECT * FROM "${targetName}" WHERE "${targetColumn}" = $1 LIMIT 1`, constraint)
                .then( (rows) => {
                    if (rows.length > 0) {
                        resolve(rows[0])
                    } else {
                        reject(`Could not find the ${targetColumn} '${constraint}' in '${targetName}'`)
                    }
                })
                .catch( (err) => {
                    reject(err)
                })

        })
    }
}
