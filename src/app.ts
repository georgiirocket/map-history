import express, { Application } from 'express';
import config from "config"
import { json, urlencoded } from "body-parser"
import cors from "cors"
import ServerHTTP from "http"
import { create_socket_server } from './api/socketRoutes/s_server';
import { db } from './db/db';
import { auth } from './handlers/middleware'
import checknicknameRoute from './api/checknickname'
import checkLogin from './api/checkLogin'
import checkOwner from './api/checkOwner'
import registerRoute from "./api/register"
import loginRoute from "./api/login"
import exitRoute from './api/exit'
import checkAccessTokenRoute from "./api/checkAccessToken"
import refreshTokenRoute from "./api/refreshToken"
import filesRoute from "./api/files"
import imageUrlRoute from "./api/getImageUrl"

const app: Application = express();
const PORT: number = config.get("port_server") || 5000
const URL: string = config.get("mongo_url")
const VER: string = config.get("version")

app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cors())

const server = ServerHTTP.createServer(app)
const io = create_socket_server(server)
app.use((req, _, next) => { req.io = io; next(); })

app.use("/api/file", auth, filesRoute)
app.use("/api/image/url", auth, imageUrlRoute)
app.use("/api/check-nickname", checknicknameRoute)
app.use("/api/check-login", checkLogin)
app.use("/api/check-ready", checkOwner)
app.use("/api/register", registerRoute)
app.use("/api/login", loginRoute)
app.use("/api/exit", auth, exitRoute)
app.use("/api/check-accesstoken", auth, checkAccessTokenRoute)
app.use("/api/check-refreshtoken", refreshTokenRoute)

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


