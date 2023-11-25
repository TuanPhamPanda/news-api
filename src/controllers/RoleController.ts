import { badRequest, internalServer } from '../middlewares'
import { Request, Response } from 'express'
import { integerSchema, stringSchema } from '../utils'
import joi from 'joi'
import { roleService } from '../services'
import { Role } from '../models'

class RoleController {
  async getAllRole(request: Request, response: Response) {
    try {
      const categories = await roleService.getAll()
      return response.json(categories)
    } catch (error: any) {
      internalServer(response, error)
    }
  }

  async getRoleById(request: Request, response: Response) {
    try {
      const { error, value } = joi
        .object({ id: integerSchema.required() })
        .validate(request.params)
      if (error) {
        return badRequest(response, error.details[0].message)
      }
      const role = await roleService.getById(value.id)
      return response.json(role)
    } catch (error: any) {
      internalServer(response, error)
    }
  }

  async createRole(request: Request, response: Response) {
    try {
      const { error, value } = joi
        .object({ name: stringSchema, description: stringSchema })
        .validate(request.body)
      if (error) {
        return badRequest(response, error.details[0].message)
      }

      const role = new Role({ ...value })
      const roleResponse = await roleService.create(role)

      return response.json(roleResponse)
    } catch (error: any) {
      internalServer(response, error)
    }
  }

  async updateRole(request: Request, response: Response) {
    try {
      const id = request.params.id

      const { value, error } = joi
        .object({
          id: integerSchema.required(),
          name: joi.string(),
          description: joi.string(),
        })
        .and('id')
        .or('name', 'description')
        .validate({ ...request.body, id })

      if (error) {
        return badRequest(response, error.details[0].message)
      }
      const role = new Role({ ...value })
      const roleResponse = await roleService.update(value.id, role)

      return response.json(roleResponse)
    } catch (error: any) {
      internalServer(response, error)
    }
  }

  async deleteRole(request: Request, response: Response) {
    try {
      const { error, value } = joi
        .object({ id: integerSchema.required() })
        .validate(request.params)
      if (error) {
        return badRequest(response, error.details[0].message)
      }

      const data = await roleService.delete(value.id)
      return response.json(data)
    } catch (error: any) {
      internalServer(response, error)
    }
  }
}

export default new RoleController()
