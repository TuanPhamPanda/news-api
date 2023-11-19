import { Router } from 'express'
import { roleController } from '../../controllers'

class RoleRoute {
  private _router: Router

  constructor() {
    this._router = Router()
    this.setUpRouter()
  }

  private setUpRouter() {
    this._router.get('/', roleController.getAllRole)
    this._router.get('/:id', roleController.getRoleById)
    this._router.post('/', roleController.createRole)
    this._router.put('/:id', roleController.updateRole)
    this._router.delete('/:id', roleController.deleteRole)
  }

  public get router() {
    return this._router
  }
}

export default new RoleRoute()
