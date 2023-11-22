import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Normal, NormalUserDetail, User } from '../models'
import { TypeUserLogin, PayloadToken } from '../containers'

class Authorization {
    handleAuthentication(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const authorizationTokenHeader = request.headers.authorization
        const token = authorizationTokenHeader?.split(' ')[1]

        if (!process.env.ACCESS_TOKEN) {
            return response.status(500).json({
                msg: 'ACCESS_TOKEN or REFRESH_TOKEN is not defined in the environment variables',
            })
        }

        if (!token) {
            return response.sendStatus(401)
        }
        jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                return response.sendStatus(403)
            }

            let isNext = false
            const payloadToken: PayloadToken = decoded as PayloadToken
            switch (payloadToken.type) {
                case TypeUserLogin.Facebook:
                    break
                case TypeUserLogin.Google:
                    break
                case TypeUserLogin.Normal:
                    const normal = await Normal.findOne({
                        where: { id: payloadToken.idUser },
                    })
                    if (normal) {
                        const normalUserDetail = await NormalUserDetail.findOne(
                            { where: { idNormal: normal.id } },
                        )
                        if (normalUserDetail) {
                            const user = await User.findOne({
                                where: { id: normalUserDetail.idUser },
                            })
                            if (user) {
                                const idRole = user.idRole
                                ;(request as any).idRole = idRole
                                isNext = true
                            }
                        }
                    }
                    break
            }

            if (isNext) {
                next()
            } else {
                return response.sendStatus(403)
            }
        })
    }

    async handleAuthorization(
        request: Request,
        response: Response,
        next: NextFunction,
    ) {
        const idRole = (request as any).idRole
        switch (idRole) {
            case 1:
                return next()
            case 2:
                return next()
            case 3:
                return next()
            default:
                return response.sendStatus(403)
        }
    }
}

export default new Authorization()
