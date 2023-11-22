import { Router } from 'express'
import { topicController } from '../../controllers'
import { authorization, upload } from '../../middlewares'

class TopicRouter {
    private _router: Router

    constructor() {
        this._router = Router()
        this.setUpRouter()
    }

    private setUpRouter() {
        this._router.get('/', topicController.getAllTopic)
        this._router.get('/:id', topicController.getTopicById)

        //private route
        this._router.delete(
            '/:id',
            //Xác thực
            authorization.handleAuthentication,
            //Ủy quyền
            authorization.handleAuthorization,
            topicController.deleteTopic,
        )
        this._router.post(
            '/',
            //Xác thực
            authorization.handleAuthentication,
            //Ủy quyền
            authorization.handleAuthorization,
            upload.single('image'),
            topicController.createTopic,
        )
        this._router.put(
            '/:id',
            //Xác thực
            authorization.handleAuthentication,
            //Ủy quyền
            authorization.handleAuthorization,
            upload.single('image'),
            topicController.updateTopic,
        )
    }

    public get router(): Router {
        return this._router
    }
}

export default new TopicRouter()
