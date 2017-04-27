import sharp from 'sharp'
import query from '../query'
import uuid from '../uuid'

export default function getImage({width, id}) {
    return query(`
        SELECT imageId, image, createdAt
        FROM images_${width}
        WHERE
            imageId = $1
        LIMIT 1
    `, id)
        .then( (imgs) => {
            if (imgs.length > 0) {
                return imgs[0]
            } else {
                return convert(width, id)
            }
        })
}

function convert(width, id) {
    return query(`
        SELECT id, original
        FROM images
        WHERE
            id = $1
        LIMIT 1
    `, id)
        .then( (imgs) => {
            if (imgs.length == 0) {
                return Promise.reject({
                    error: 'does not exist',
                    description: "The image " + id + " does not exist"
                })
            } else {
                return resizeAndStore(imgs[0], width)
            }
        })
}

function resizeAndStore(img, width) {
    const a = img.original
    const comma = a.indexOf(',')+1
    const encoding = a.slice(0, comma)
    const base = a.slice(comma)
    const buf = Buffer.from(base, 'base64')

    sharp(buf)
        .resize(width)
        .jpeg()
        .toBuffer( (err, buffer, info) => {
            if (err) {
                console.log(err)
                return Promise.reject({
                    error: 'could not resize',
                    description: err,
                })
            } else {
                const newImage = 'data:image/jpeg;base64,' + buffer.toString('base64');
                const date = new Date()

                return query(`
                    INSERT INTO images_${width} (id, imageId, image, createdAt)
                    VALUES ($1, $2, $3, $4)
                `, uuid(), img.id, newImage, date)
                    .then( () => {
                        return {
                            imageId: img.id,
                            image: newImage,
                            createdAt: date,
                        }
                    })
            }
        })
}
