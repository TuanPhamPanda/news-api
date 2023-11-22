import { Router } from 'express'
import { authorizationController } from '../../controllers'

class AuthorizationRouter {
    private _router: Router

    constructor() {
        this._router = Router()

        this._router.post(
            '/register',
            authorizationController.registerWithUsername,
        )
        this._router.post(
            '/register-google',
            authorizationController.registerWithUsername,
        )
        this._router.post(
            '/register-facebook',
            authorizationController.registerFacebook,
        )
        this._router.post('/login', authorizationController.loginWithUsername)
        this._router.post('/login-google', authorizationController.loginGoogle)
        this._router.post(
            '/login-facebook',
            authorizationController.loginFacebook,
        )
        this._router.post(
            '/refresh-token',
            authorizationController.refreshToken,
        )
        this._router.post('/logout', authorizationController.logout)
    }

    public get router(): Router {
        return this._router
    }
}

export default new AuthorizationRouter()
