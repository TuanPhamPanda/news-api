import { Router } from 'express'
import { categoryController } from '../../controllers'

class CategoryRouter {
  private _router: Router

  constructor() {
    this._router = Router()
    this.setUpRouter()
  }

  private setUpRouter() {
    this._router.get('/', categoryController.getAllCategory)
    this._router.get('/:id', categoryController.getCategoryById)
    this._router.post('/', categoryController.createCategory)
    this._router.put('/:id', categoryController.updateCategory)
    this._router.delete('/:id', categoryController.deleteCategory)
  }

  public get router(): Router {
    return this._router
  }
}

export default new CategoryRouter()
