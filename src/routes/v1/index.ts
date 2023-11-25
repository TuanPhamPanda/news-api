import categoryRouter from './CategoryRouter'
import topicRouter from './TopicRoute'
import routeRote from './RoleRoute'
import newRoute from './NewRoute'
import { Router } from 'express'
import userRouter from './UserRouter'
import { authorization } from '../../middlewares'

class NewRouterV1 {
    private _router: Router

    constructor() {
        this._router = Router()
        this._router.use('/category', categoryRouter.router)
        this._router.use('/topic', topicRouter.router)
        this._router.use('/new', newRoute.router)
        this._router.use(
            '/role',
            //Xác thực
            authorization.handleAuthentication,
            //Ủy quyền
            authorization.handleAuthorization,
            routeRote.router,
        )
        this._router.use('/user', userRouter.router)
    }

    public get router(): Router {
        return this._router
    }
}

export default new NewRouterV1()
