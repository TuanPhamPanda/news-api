import { Request, Response } from 'express'
import { badRequest, internalServer } from '../middlewares'
import joi from 'joi'
import { phoneNumberSchema, stringSchema } from '../utils'
import { Normal, User } from '../models'
import { TypeUserLogin } from '../containers'
import userService from '../services/UserService'

class UserController {
    async createUserAdmin(request: Request, response: Response){}
    async getAllUser(request: Request, response: Response) {}
    async getByUserName(request: Request, response: Response) {}
    async updateUser(request: Request, response: Response) {}
    async deleteUser(request: Request, response: Response) {}
}

export default new UserController()
