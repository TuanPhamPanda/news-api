import { badRequest, internalServer } from '../middlewares'
import { topicService } from '../services'
import { Request, Response } from 'express'
import { idSchema, imageSchema, stringSchema } from '../utils'
import { Topic } from '../models'
import joi from 'joi'
import { cloudinary } from '../configs'

class TopicController {
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
        .object({
          title: stringSchema,
          description: stringSchema,
          image: imageSchema,
        })
        .validate({
          ...request.body,
          image: request.file?.path,
        })
      if (error) {
        if (request.file)
          await cloudinary.uploader.destroy(request.file?.filename)
        return response.status(400).json({ error: error.details[0].message })
      }

      const topic = new Topic({ ...value, filename: request.file?.filename })
      const topicResponse = await topicService.create(topic)
      return response.json(topicResponse)
    } catch (error: any) {
      if (request.file)
        await cloudinary.uploader.destroy(request.file?.filename)
      internalServer(response, error)
    }
  }

  async updateTopic(request: Request, response: Response) {
    try {
      const id = request.params.id

      const { error, value } = joi.object({ id: idSchema }).validate({ id })

      if (error) {
        if (request.file)
          await cloudinary.uploader.destroy(request.file.filename)
        return badRequest(response, error.details[0].message)
      }

      if (Object.keys(request.body).length === 0 && !request.file) {
        return badRequest(
          response,
          'At least one field is required for the update.',
        )
      }

      const image: { filename: string | undefined; image: string | undefined } =
        {
          filename: undefined,
          image: undefined,
        }

      if (request.file) {
        image.filename = request.file.filename
        image.image = request.file.path
      }
      const topic = new Topic({ ...request.body, ...image, id })
      const topicResponse = await topicService.update(value.id, topic)

      return response.json(topicResponse)
    } catch (error: any) {
      if (request.file) await cloudinary.uploader.destroy(request.file.filename)
      return internalServer(response, error)
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
      internalServer(response, error)
    }
  }
}

export default new TopicController()
