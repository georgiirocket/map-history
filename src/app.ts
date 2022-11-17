import * as dotenv from 'dotenv'
dotenv.config()
import { db } from './db/db';
import { server } from './server/createServer'

const PORT: number = Number(process.env.SERVER_PORT) || 5000
const URL: string = process.env.MONGO_URL || ""
const VER: string = process.env.VERSION || "Not version"

async function start() {
    try {
        db.mapdb_init()
        server.listen(PORT, () => {
            console.group('Map_history')
            console.log(`Launch mode: ${VER}.`)
            console.log(`Mongo base: ${URL}.`)
            console.log(`App has been started on port ${PORT}...`)
            console.groupEnd()
        })
    } catch (e) {
        console.log('Server Error', e)
        process.exit(1)
    }
}
start()


