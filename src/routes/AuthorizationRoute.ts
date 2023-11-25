import { Router } from 'express'
import authRouterV1 from './v1/AuthorizationRoute'

class AuthorizationRoute {
  private _router: Router
  constructor() {
    this._router = Router()
    this._router.use('/v1/auth', authRouterV1.router)
  }

  public get router(): Router {
    return this._router
  }
}

export default new AuthorizationRoute()
