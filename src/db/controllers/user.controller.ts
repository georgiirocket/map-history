import { db_connect } from './db.controller'
import mongoose from 'mongoose';
import { NewUserData } from "../../interface/def_if"
import { IUser } from "../../schema/user"

export class user_controller {
    #users_model: mongoose.Model<IUser>
    constructor(database: db_connect) {
        this.#users_model = database.users_model
    }

    async checkLogin(l: string): Promise<IUser | null> {
        return await this.#users_model.findOne({ login: l })
    }

    async checkLoginWithoutId(l: string, id: string = ""): Promise<IUser | null> {
        return await this.#users_model.findOne({
            login: l,
            _id: { $ne: id }
        })
    }

    async checkNickname(n: string): Promise<IUser | null> {
        return await this.#users_model.findOne({ nickname: n })
    }

    async checkNicknameWithoutId(n: string, id: string = ""): Promise<IUser | null> {
        return await this.#users_model.findOne({
            nickname: n,
            _id: { $ne: id }
        })
    }

    async createUser(data: NewUserData): Promise<IUser> {
        if (data.owner) {
            const check_owner = await this.checkOwner()
            if (check_owner) {
                throw new Error("owner exist")
            }
        }
        const newUser = new this.#users_model({
            ...data,
            role: data.owner ? ["owner", "admin", "user"] : ["user"]
        })
        return await newUser.save()
    }

    async findUserById(id: string = ""): Promise<IUser> {
        const user = await this.#users_model.findById(id)
        if (!user) {
            throw new Error("not found user")
        }
        return user
    }

    async checkOwner(): Promise<IUser | null> {
        return await this.#users_model.findOne({ role: { $all: ["owner"] } })
    }
}