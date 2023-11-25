import Response from './Response'

const notFoundDatabase = (tableName: string, id: number) => {
    return {
        err: 1,
        msg: `No ${tableName} found with id ${id}`,
    }
}

const internalSeverDatabase = (message: string) => {
    return {
        err: 1,
        msg: message,
    }
}

const responseFindDatabase = (response: Response): Response => {
    const result: Record<string, any> = {
        err: response.err ?? 0,
    }

    if (response.msg) {
        result.msg = response.msg
    }

    if (typeof response.response === 'object') {
        if (Array.isArray(response.response)) {
            result.response.response = response.response
        } else {
            for (const key in response.response) {
                if (response.response.hasOwnProperty(key)) {
                    result[key] = response.response[key]
                }
            }
        }
    } else {
        result.response = response.response
    }
    return result
}

const foldersInCloud = ['new', 'topic', 'user']

enum TypeUserLogin {
    Google = 'Google',
    Facebook = 'Facebook',
    Normal = 'Normal',
    //Twitter
    //Apple
    //Github
}

const expiresInDayAccess = process.env.EXPIRES_IN_DAY_ACCESS_TOKEN
    ? +process.env.EXPIRES_IN_DAY_ACCESS_TOKEN
    : 1

const expiresInDayRefresh = process.env.EXPIRES_IN_DAY_REFRESH_TOKEN
    ? +process.env.EXPIRES_IN_DAY_REFRESH_TOKEN
    : 1

const expirationTimeAccess = () =>
    Math.floor(Date.now() / 1000) + expiresInDayAccess * 24 * 60 * 60

const expirationTimeRefresh = () =>
    Math.floor(Date.now() / 1000) + expiresInDayRefresh * 24 * 60 * 60

interface PayloadToken {
    idUser: number
    idRole: number
    type: TypeUserLogin
    iat?: number
    exp: number
}

interface INewsAllParams {
    orderType?: 'view' | 'recent'
    limit?: number
    author?: {
        authorId: number
    },
    category?: {
        categoryId: number
    },
    topic?: {
        topicId: number
    }
}

export {
    notFoundDatabase,
    internalSeverDatabase,
    responseFindDatabase,
    foldersInCloud,
    Response,
    TypeUserLogin,
    expirationTimeAccess,
    expirationTimeRefresh,
    PayloadToken,
    INewsAllParams
}
