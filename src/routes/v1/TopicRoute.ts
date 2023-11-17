import { Router } from 'express'
import { topicController } from '../../controllers'
import { upload } from '../../middlewares'

class TopicRouter {
  private _router: Router

  constructor() {
    this._router = Router()
    this.setUpRouter()
  }

  private setUpRouter() {
    this._router.get('/', topicController.getAllTopic)
    this._router.get('/:id', topicController.getTopicById)
    this._router.delete('/:id', topicController.deleteTopic)

    this._router.post('/', upload.single('image'), topicController.createTopic)
    this._router.put(
      '/:id',
      upload.single('image'),
      topicController.updateTopic,
    )
  }

  public get router(): Router {
    return this._router
  }
}

export default new TopicRouter()
