import { Router } from 'express'
import { categoryController } from '../../controllers'
import { authorization } from '../../middlewares'

class CategoryRouter {
    private _router: Router

    constructor() {
        this._router = Router()
        this.setUpRouter()
    }

    private setUpRouter() {
        this._router.get('/', categoryController.getAllCategory)
        this._router.get('/:id', categoryController.getCategoryById)

        //private route
        this._router.post(
            '/',
            //Xác thực
            authorization.handleAuthentication,
            //Ủy quyền
            authorization.handleAuthorization,
            categoryController.createCategory,
        )
        this._router.put(
            '/:id',
            //Xác thực
            authorization.handleAuthentication,
            //Ủy quyền
            authorization.handleAuthorization,
            categoryController.updateCategory,
        )
        this._router.delete(
            '/:id',
            //Xác thực
            authorization.handleAuthentication,
            //Ủy quyền
            authorization.handleAuthorization,
            categoryController.deleteCategory,
        )
    }

    public get router(): Router {
        return this._router
    }
}

export default new CategoryRouter()
