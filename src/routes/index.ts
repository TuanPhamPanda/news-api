import { Router } from 'express'
import newRouterV1 from './v1'

class NewRouter {
  private _router: Router
  constructor() {
    this._router = Router()
    this._router.use('/v1', newRouterV1.router)
  }

  public get router(): Router {
    return this._router
  }
}

export default new NewRouter()
