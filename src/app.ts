import express, { Application } from 'express';
import config from "config"
import { Server as ServerIO } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from './interface/socket_if'
import { json, urlencoded } from "body-parser"
import cors from "cors"
import ServerHTTP from "http"
import mongoose from 'mongoose';
import { auth } from './handlers/middleware'
import checknicknameRoute from './api/checknickname'
import registerRoute from "./api/register"
import loginRoute from "./api/login"
import exitRoute from './api/exit'
import checkAccessTokenRoute from "./api/checkAccessToken"
import refreshTokenRoute from "./api/refreshToken"

const app: Application = express();
const PORT: number = config.get("port_server") || 5000
const URL: string = config.get("mongo_url")
const VER: string = config.get("version")

app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cors())

const server = ServerHTTP.createServer(app)
const io = new ServerIO<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
    cors: {
        origin: [
            "http://192.168.31.136:3500",
            "http://localhost:3500",
            "http://192.168.1.34:3500"
        ],
        methods: ["GET", "POST"]
    }
})
io.on('connection', (socket) => console.log("Connected sockedID: ", socket.id))
app.use((req, _, next) => { req.io = io; next(); })

app.use("/api/check-nickname", checknicknameRoute)
app.use("/api/register", registerRoute)
app.use("/api/login", loginRoute)
app.use("/api/exit", auth, exitRoute)
app.use("/api/check-accesstoken", auth, checkAccessTokenRoute)
app.use("/api/check-refreshtoken", refreshTokenRoute)

async function start() {
    try {
        await mongoose.connect(URL)
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


