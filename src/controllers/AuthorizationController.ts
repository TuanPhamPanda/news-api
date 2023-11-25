import { Request, Response } from 'express'
import { badRequest, internalServer } from '../middlewares'
import joi from 'joi'
import { phoneNumberSchema, stringSchema } from '../utils'
import { Normal, User } from '../models'
import {
    expirationTimeAccess,
    PayloadToken,
    responseFindDatabase,
} from '../containers'
import userService from '../services/UserService'
import jwt from 'jsonwebtoken'

class AuthorizationController {
    //register with username
    async registerWithUsername(request: Request, response: Response) {
        try {
            const { value, error } = joi
                .object({
                    username: stringSchema.min(6),
                    password: stringSchema.min(8),
                    phoneNumber: phoneNumberSchema,
                    fullName: stringSchema,
                })
                .validate({ ...request.body })
            if (error) {
                return badRequest(response, error.details[0].message)
            }

            const normalData = {
                username: value.username,
                password: value.password,
            }

            const userData = {
                phoneNumber: value.phoneNumber,
                fullName: value.fullName,
            }

            const normal = new Normal({ ...normalData })
            const user = new User({ ...userData })
            const userResponse = await userService.registerNormal(user, normal)
            return response.json(userResponse)
        } catch (error) {
            return internalServer(response, error)
        }
    }

    async registerGoogle(request: Request, response: Response) {}

    async registerFacebook(request: Request, response: Response) {}

    //login google
    async loginGoogle(request: Request, response: Response) {}

    //login facebook
    async loginFacebook(request: Request, response: Response) {}

    //login with username
    async loginWithUsername(request: Request, response: Response) {
        try {
            const { value, error } = joi
                .object({
                    username: stringSchema.min(6),
                    password: stringSchema.min(8),
                })
                .validate({ ...request.body })

            if (error) {
                return badRequest(response, error.details[0].message)
            }
            const userResponse = await userService.loginWithUsername({
                password: value.password,
                username: value.username,
            })

            return response.json(userResponse)
        } catch (error) {
            response.json(internalServer(response, error))
        }
    }

    //refresh token
    async refreshToken(request: Request, response: Response) {
        try {
            if (!process.env.ACCESS_TOKEN || !process.env.REFRESH_TOKEN) {
                return internalServer(
                    response,
                    'ACCESS_TOKEN or REFRESH_TOKEN is not defined in the environment variables',
                )
            }

            const token: string = request.body.token
            if (!token) {
                return response.sendStatus(401)
            }

            const normal = await Normal.findOne({
                where: { refreshToken: token },
            })
            if (!normal) {
                return response.sendStatus(403)
            }
            const decoded = jwt.verify(
                token,
                process.env.REFRESH_TOKEN,
            ) as PayloadToken
            if (!decoded) {
                return response.sendStatus(403)
            }

            const payloadAccessToken: PayloadToken = {
                idUser: decoded.idUser,
                idRole: decoded.idRole,
                iat: decoded.iat,
                exp: expirationTimeAccess(),
                type: decoded.type,
            }

            const accessToken = jwt.sign(
                {
                    ...payloadAccessToken,
                },
                process.env.ACCESS_TOKEN,
            )

            return response.status(200).json({ accessToken })
        } catch (error) {
            return internalServer(response, error)
        }
    }

    //logout
    async logout(request: Request, response: Response) {
        try {
            const token: string = request.body.token
            if (!token) {
                return response.sendStatus(401)
            }
            const normal = await Normal.findOne({
                where: { refreshToken: token },
            })
            if (!normal) {
                return response.sendStatus(403)
            }
            await normal.update({ refreshToken: null })
            return response.json(200).json(
                responseFindDatabase({
                    err: 0,
                    msg: 'Logout successfully!!!',
                }),
            )
        } catch (error) {
            return internalServer(response, error)
        }
    }
}

export default new AuthorizationController()
