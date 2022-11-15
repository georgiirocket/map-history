import * as dotenv from 'dotenv'
dotenv.config()
import express, { Application } from 'express';
import { json, urlencoded } from "body-parser"
import path from "path"
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
import profileRoute from "./api/profile"

const app: Application = express();
const PORT: number = Number(process.env.SERVER_PORT) || 5000
const URL: string = process.env.MONGO_URL || ""
const VER: string = process.env.VERSION || "Not version"

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
app.use("/api/profile", auth, profileRoute)

app.use(express.static(path.join(__dirname, './build')))
app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'))
})

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


