import { badRequest, internalServer } from '../middlewares'
import categoryService from '../services/CategoryService'
import { Request, Response } from 'express'
import { integerSchema, stringSchema } from '../utils'
import { Category } from '../models'
import joi from 'joi'

class CategoryController {
  async getAllCategory(request: Request, response: Response) {
    try {
      const categories = await categoryService.getAll()
      return response.json(categories)
    } catch (error: any) {
      internalServer(response, error)
    }
  }

  async getCategoryById(request: Request, response: Response) {
    try {
      const { error, value } = joi
        .object({ id: integerSchema.required() })
        .validate(request.params)
      if (error) {
        return badRequest(response, error.details[0].message)
      }
      const category = await categoryService.getById(value.id)
      return response.json(category)
    } catch (error: any) {
      internalServer(response, error)
    }
  }

  async createCategory(request: Request, response: Response) {
    try {
      const { error, value } = joi
        .object({ name: stringSchema })
        .validate(request.body)
      if (error) {
        return badRequest(response, error.details[0].message)
      }
      const category = new Category(value)

      const categoryResponse = await categoryService.create(category)

      return response.json(categoryResponse)
    } catch (error: any) {
      internalServer(response, error.message)
    }
  }

  async updateCategory(request: Request, response: Response) {
    try {
      const id = request.params.id
      const { name } = request.body

      const { error, value } = joi
        .object({ id: integerSchema.required(), name: stringSchema })
        .validate({ id, name })
      if (error) {
        return badRequest(response, error.details[0].message)
      }

      const category = new Category({ id: value.id, name: value.name })

      const categoryResponse = await categoryService.update(value.id, category)

      return response.json(categoryResponse)
    } catch (error: any) {
      internalServer(response, error.message)
    }
  }

  async deleteCategory(request: Request, response: Response) {
    try {
      const { error, value } = joi
        .object({ id: integerSchema })
        .validate(request.params)
      if (error) {
        return badRequest(response, error.details[0].message)
      }

      const data = await categoryService.delete(value.id)
      return response.json(data)
      
    } catch (error: any) {
      internalServer(response, error.message)
    }
  }
}

export default new CategoryController()
