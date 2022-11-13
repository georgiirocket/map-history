import { Router } from 'express'
import { Res } from '../interface/def_if'
import { user_controller, logsEvent_controller } from '../db/db'
import BCrypt from "bcrypt"
const router = Router()

interface RequestDataEdit {
    login: string,
    password: string,
    nickname: string
}

interface AnswerResponseEdit {
    nickname: string
    login: string
}
interface AnswerResponseGetUserData extends AnswerResponseEdit {
}
router.get("/info", async (req, res) => {
    const answer: Res<AnswerResponseGetUserData> = {
        status: 1,
        error: null,
        data: {
            nickname: "",
            login: ""
        }
    }
    try {
        const user = await user_controller.findUserById(req.userId)
        answer.data.login = user.login
        answer.data.nickname = user.nickname
        res.json(answer)
    } catch (err: any) {
        const answer: Res<null> = {
            status: 0,
            data: null,
            error: err ? err.toString() : ""
        }
        res.status(500).send(answer)
        logsEvent_controller.logs({
            message: "Change data profile route fail",
            error: err ? err.toString() : ""
        })
    }
})

router.put("/edit", async (req, res) => {
    const answer: Res<AnswerResponseEdit> = {
        status: 1,
        error: null,
        data: {
            nickname: "",
            login: ""
        }
    }
    try {
        const bodyData: RequestDataEdit = req.body
        const user = await user_controller.findUserById(req.userId)
        if (bodyData.nickname && (bodyData.nickname.length < 6 || bodyData.nickname.length > 20)) {
            throw new Error("This nickname has wrong lenght")
        }
        if (bodyData.login && (bodyData.login.length < 6)) {
            throw new Error("This login has wrong lenght")
        }
        if (bodyData.password && (bodyData.password.length < 8)) {
            throw new Error("This password has wrong lenght")
        }
        if (!bodyData.login && !bodyData.nickname && !bodyData.password) {
            answer.data.nickname = user.nickname
            answer.data.login = user.login
            return res.json(answer)
        }
        if (bodyData.nickname) {
            const checkNickname = await user_controller.checkNicknameWithoutId(bodyData.nickname, req.userId)
            if (checkNickname) {
                throw new Error("This nickname exists")
            }
        }
        if (bodyData.login) {
            const checkLogin = await user_controller.checkLoginWithoutId(bodyData.login, req.userId)
            if (checkLogin) {
                throw new Error("Create another login")
            }
        }
        if (bodyData.nickname) {
            user.nickname = bodyData.nickname
        }
        if (bodyData.login) {
            user.login = bodyData.login
        }
        if (bodyData.password) {
            const hashPass = await BCrypt.hash(bodyData.password, 12)
            user.password = hashPass
        }
        await user.save()
        answer.data.nickname = user.nickname
        answer.data.login = user.login
        res.json(answer)
    } catch (err: any) {
        const answer: Res<null> = {
            status: 0,
            data: null,
            error: err ? err.toString() : ""
        }
        res.status(500).json(answer)
        logsEvent_controller.logs({
            message: "Change data profile route fail",
            error: err ? err.toString() : ""
        })
    }
})
export default router