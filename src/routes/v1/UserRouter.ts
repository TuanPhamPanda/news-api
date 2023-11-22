import { Router } from 'express'
import { userController } from '../../controllers'

class UserRouter {
    private _router: Router

    constructor() {
        this._router = Router()
        this.setUpRouter()
    }

    public get router(): Router {
        return this._router
    }

    private setUpRouter() {
        //add
        //remove
        //read all
        //read by id
        //update
    }
}

export default new UserRouter()
