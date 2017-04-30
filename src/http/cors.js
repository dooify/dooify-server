import cors from 'cors'

const origin = []
origin.push('http://localhost:3000')

export default function c(app) {
    app.use(cors({
        credentials: true,
        origin,
    }))
}
