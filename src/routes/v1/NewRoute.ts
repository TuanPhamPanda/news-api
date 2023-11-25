import { Router } from 'express'
import { newController } from '../../controllers'
import { authorization, upload } from '../../middlewares'

class NewsRoute {
    private _router: Router

    constructor() {
        this._router = Router()
        this.setupRoute()
    }

    public get router(): Router {
        return this._router
    }

    private setupRoute() {
        this._router.get('/:slug', newController.getNewBySlug)
        this._router.post('/getAll', newController.getAllNew)

        this._router.post(
            '/',
            //Xác thực
            authorization.handleAuthentication,
            //Ủy quyền
            authorization.handleAuthorization,
            upload.single('image'),
            newController.createNew,
        )
        this._router.put(
            '/:id',
            //Xác thực
            authorization.handleAuthentication,
            //Ủy quyền
            authorization.handleAuthorization,
            upload.single('image'),
            newController.updateNew,
        )

        this._router.delete(
            '/:id',
            //Xác thực
            authorization.handleAuthentication,
            //Ủy quyền
            authorization.handleAuthorization,
            newController.deleteNew,
        )
    }
}

export default new NewsRoute()
