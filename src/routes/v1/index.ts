import categoryRouter from './CategoryRouter'
import topicRouter from './TopicRoute'
import { Router } from 'express'

class NewRouterV1 {
  private _router: Router
  constructor() {
    this._router = Router()
    this._router.use('/category', categoryRouter.router)
    this._router.use('/topic', topicRouter.router)
  }

  public get router(): Router {
    return this._router
  }
}

export default new NewRouterV1()