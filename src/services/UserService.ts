import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

import {
    PayloadToken,
    TypeUserLogin,
    expirationTimeAccess,
    expirationTimeRefresh,
    internalSeverDatabase,
    notFoundDatabase,
    responseFindDatabase,
} from '../containers'
import { User, Normal, NormalUserDetail } from '../models'

interface LoginUserNormalRequest {
    username: string
    password: string
}

class UserService {
    getAll() {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await User.findAll()
                return resolve(
                    responseFindDatabase({ err: 0, response: users }),
                )
            } catch (error: any) {
                reject(internalSeverDatabase(error.message))
            }
        })
    }
    getById(id: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findByPk(id)
                if (user) {
                    return resolve(
                        responseFindDatabase({ err: 0, response: user }),
                    )
                } else {
                    return resolve(notFoundDatabase('users', id))
                }
            } catch (error: any) {
                return reject(internalSeverDatabase(error.message))
            }
        })
    }
    loginWithUsername({ username, password }: LoginUserNormalRequest) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!process.env.ACCESS_TOKEN || !process.env.REFRESH_TOKEN) {
                    return reject(
                        'ACCESS_TOKEN or REFRESH_TOKEN is not defined in the environment variables',
                    )
                }

                let isLogin = false
                const normal = await Normal.findOne({ where: { username } })
                if (normal) {
                    const normalUserDetail = await NormalUserDetail.findOne({
                        where: { idNormal: normal.id },
                    })
                    if (normalUserDetail) {
                        const user = await User.findOne({
                            where: { id: normalUserDetail.idUser },
                        })

                        if (user) {
                            if (
                                bcryptjs.compareSync(password, normal.password)
                            ) {
                                isLogin = true
                                const accessTokenPayload: PayloadToken = {
                                    idUser: normal.id,
                                    idRole: user.idRole,
                                    type: TypeUserLogin.Normal,
                                    iat: Math.floor(Date.now() / 1000),
                                    exp: expirationTimeAccess(),
                                }

                                const refreshTokenPayload: PayloadToken = {
                                    idUser: normal.id,
                                    idRole: user.idRole,
                                    type: TypeUserLogin.Normal,
                                    iat: Math.floor(Date.now() / 1000),
                                    exp: expirationTimeRefresh(),
                                }

                                const accessToken = jwt.sign(
                                    {
                                        ...accessTokenPayload,
                                    },
                                    process.env.ACCESS_TOKEN,
                                )
                                const refreshToken = jwt.sign(
                                    {
                                        ...refreshTokenPayload,
                                    },
                                    process.env.REFRESH_TOKEN,
                                )

                                await normal.update({ refreshToken })

                                return resolve({ accessToken, refreshToken })
                            }
                        }
                    }
                }

                if (!isLogin) {
                    return resolve(
                        responseFindDatabase({
                            err: 1,
                            msg: 'Incorrect username or password. Login failed!',
                        }),
                    )
                }
            } catch (error) {
                return reject(error)
            }
        })
    }
    registerNormal(user: User, value: Normal) {
        return new Promise(async (resolve, reject) => {
            try {
                const [normalData, created] = await Normal.findOrCreate({
                    where: {
                        username: value.username,
                    },
                    defaults: {
                        ...value,
                        password: bcryptjs.hashSync(value.password, 8),
                    },
                })
                if (created) {
                    const userData = await user.save()
                    if (userData.isNewRecord) {
                        return resolve(
                            responseFindDatabase({
                                err: 1,
                                msg: 'Create user failed',
                            }),
                        )
                    }
                    const normalUserDetail = new NormalUserDetail({
                        idNormal: normalData.id,
                        idUser: userData.id,
                    })
                    const normalUserDetailSaved = await normalUserDetail.save()
                    if (normalUserDetailSaved.isNewRecord) {
                        return resolve(
                            responseFindDatabase({
                                err: 1,
                                msg: 'Create normal user detail failed',
                            }),
                        )
                    }
                    return resolve(
                        responseFindDatabase({
                            err: 0,
                            msg: 'Create user successfully',
                        }),
                    )
                } else {
                    return resolve(
                        responseFindDatabase({
                            err: 1,
                            msg: 'Username already exist',
                        }),
                    )
                }
            } catch (error: any) {
                return reject(internalSeverDatabase(error.message))
            }
        })
    }
    delete(id: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const existingUser = await User.findByPk(id)
                if (existingUser) {
                    await existingUser.destroy()
                    resolve(
                        responseFindDatabase({
                            msg: `Delete user successfully with id: ${id}`,
                        }),
                    )
                } else {
                    resolve(notFoundDatabase('user', id))
                }
            } catch (error: any) {
                return reject(internalSeverDatabase(error.message))
            }
        })
    }
    update(id: number, data: User) {
        return new Promise(async (resolve, reject) => {
            try {
                const existingUser = await User.findByPk(id)

                if (existingUser) {
                    const [affectedRows] = await User.update(data.dataValues, {
                        where: { id },
                    })

                    if (affectedRows > 0) {
                        const userData = await User.findByPk(id)
                        resolve(
                            responseFindDatabase({
                                msg: `User with id ${id} updated successfully.`,
                                response: { user: userData },
                                err: 0,
                            }),
                        )
                    } else {
                        resolve(
                            responseFindDatabase({
                                err: 1,
                                msg: `No user found with ID ${id} or no changes were made.`,
                            }),
                        )
                    }
                } else {
                    resolve(
                        responseFindDatabase({
                            err: 1,
                            msg: `No user found with ID ${id}.`,
                        }),
                    )
                }
            } catch (error: any) {
                return reject(internalSeverDatabase(error.message))
            }
        })
    }
}

export default new UserService()
