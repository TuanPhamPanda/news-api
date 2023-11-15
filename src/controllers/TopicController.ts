import { internalServer } from '../middlewares'
import { topicService } from '../services'
import { Request, Response } from 'express'
import { idSchema, nameSchema } from '../utils/ValidateSchema'
import { Topic } from '../models'
import joi from 'joi'

class CategoryController {
  async getAllTopic(request: Request, response: Response) {
    try {
      const topics = await topicService.getAll()
      return response.json(topics)
    } catch (error: any) {
      internalServer(response, error)
    }
  }

  async getTopicById(request: Request, response: Response) {
    try {
      const { error, value } = joi
        .object({ id: idSchema })
        .validate(request.params)
      if (error) {
        return response.status(400).json({ error: error.details[0].message })
      }
      const topic = await topicService.getById(value.id)
      return response.json(topic)
    } catch (error: any) {
      internalServer(response, error)
    }
  }

  async createTopic(request: Request, response: Response) {
    try {
      const { error, value } = joi
        .object({ name: nameSchema })
        .validate(request.body)
      if (error) {
        return response.status(400).json({ error: error.details[0].message })
      }
      const topic = new Topic(value)

      const topicResponse = await topicService.create(topic)

      return response.json(topicResponse)
    } catch (error: any) {
      internalServer(response, error.message)
    }
  }

  async updateTopic(request: Request, response: Response) {
    try {
      const id = request.params.id
      const { name } = request.body

      const { error, value } = joi
        .object({ id: idSchema, name: nameSchema })
        .validate({ id, name })
      if (error) {
        return response.status(400).json({ error: error.details[0].message })
      }

      const topic = new Topic({ id: value.id, name: value.name })

      const topicResponse = await topicService.update(value.id, topic)

      return response.json(topicResponse)
    } catch (error: any) {
      internalServer(response, error.message)
    }
  }

  async deleteTopic(request: Request, response: Response) {
    try {
      const { error, value } = joi
        .object({ id: idSchema })
        .validate(request.params)
      if (error) {
        return response.status(400).json({ error: error.details[0].message })
      }

      const data = await topicService.delete(value.id)
      return response.json(data)
    } catch (error: any) {
      internalServer(response, error.message)
    }
  }
}

export default new CategoryController()
