import { Router } from 'express'
import { topicController } from '../../controllers'

class TopicRouter {
  private _router: Router

  constructor() {
    this._router = Router()
    this.setUpRouter()
  }

  private setUpRouter() {
    this._router.get('/', topicController.getAllTopic)
    this._router.get('/:id', topicController.getTopicById)
    this._router.post('/', topicController.createTopic)
    this._router.put('/:id', topicController.updateTopic)
    this._router.delete('/:id', topicController.deleteTopic)
  }

  public get router(): Router {
    return this._router
  }
}

export default new TopicRouter()
