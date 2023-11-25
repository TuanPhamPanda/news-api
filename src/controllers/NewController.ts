import { Request, Response } from 'express'
import joi from 'joi'

import { newService } from '../services'
import { imageSchema, integerSchema, stringSchema } from '../utils'
import { INewsAllParams } from '../containers'
import { badRequest, internalServer } from '../middlewares'
import { New } from '../models'
import { cloudinary } from '../configs'

interface NewRequest {
    id: number
    title: string
    summary: string
    image: string
    slug: string
    content: string
    idCategory: number
    idTopic: number
    idUser: number
    status?: boolean
}

class NewController {
    async getAllNew(request: Request, response: Response) {
        try {
            const { error, value } = joi
                .object<INewsAllParams>({
                    orderType: joi.valid('view', 'recent').required(),
                    limit: joi.number().integer().min(1).required(),
                    author: joi.object({
                        authorId: integerSchema.required(),
                    }),
                    category: joi.object({
                        categoryId: integerSchema.required(),
                    }),
                    topic: joi.object({
                        topicId: integerSchema.required(),
                    }),
                })
                .validate({
                    ...request.body,
                })

            if (error) {
                return response
                    .status(400)
                    .json({ error: error.details[0].message })
            }

            const news = await newService.getAllNews({
                orderType: value.orderType,
                limit: value.limit,
                author: value.author,
                category: value.category,
                topic: value.topic,
            })

            return response.json(news)
        } catch (error) {
            return internalServer(response, error)
        }
    }

    async getNewBySlug(request: Request, response: Response) {
        try {
            const { error, value } = joi
                .object({ slug: stringSchema })
                .validate(request.params)
            if (error) {
                return badRequest(response, error.details[0].message)
            }
            const newData = await newService.getBySlug(value.slug)
            return response.status(200).json(newData)
        } catch (error) {
            return internalServer(response, error)
        }
    }

    async createNew(request: Request, response: Response) {
        try {
            const { error, value } = joi
                .object<NewRequest>({
                    title: stringSchema,
                    summary: stringSchema,
                    content: stringSchema,
                    image: imageSchema,
                    idCategory: integerSchema.required(),
                    idTopic: integerSchema.required(),
                    idUser: integerSchema.required(),
                })
                .validate({ ...request.body, image: request.file?.path })
            if (error) {
                if (request.file)
                    await cloudinary.uploader.destroy(request.file?.filename)
                return badRequest(response, error.details[0].message)
            }

            value.slug = value.title.replaceAll(' ', '-')

            const newResponse = await newService.create(
                new New({
                    ...value,
                    filename: request.file?.filename,
                    view: 0,
                }),
            )

            return response.json(newResponse)
        } catch (error) {
            if (request.file)
                await cloudinary.uploader.destroy(request.file.filename)
            return internalServer(response, error)
        }
    }

    async updateNew(request: Request, response: Response) {
        try {
            const { error, value } = joi
                .object<NewRequest>({
                    id: integerSchema.required(),
                    content: stringSchema,
                    image: imageSchema,
                    summary: stringSchema,
                    title: stringSchema,
                    idCategory: integerSchema,
                    idTopic: integerSchema,
                    idUser: integerSchema,
                    status: joi.boolean(),
                })
                .validate({
                    ...request.body,
                    id: request.params.id,
                    image: request.file?.path,
                })

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

            const image: {
                filename: string | undefined
                image: string | undefined
            } = {
                filename: undefined,
                image: undefined,
            }

            if (request.file) {
                image.filename = request.file.filename
                image.image = request.file.path
            }

            value.slug = value.title.replaceAll(' ', '-')

            const newResponse = await newService.update(
                value.id,
                new New({ ...request.body, ...image, id: value.id }),
            )

            return response.json(newResponse)
        } catch (error) {
            if (request.file)
                await cloudinary.uploader.destroy(request.file.filename)
            internalServer(response, error)
        }
    }

    async deleteNew(request: Request, response: Response) {
        try {
            const { error, value } = joi
                .object({ id: integerSchema.required() })
                .validate(request.params)
            if (error) {
                badRequest(response, error.details[0].message)
            }
            const deletedData = await newService.delete(value.id)

            return response.json(deletedData)
        } catch (error) {
            return internalServer(response, error)
        }
    }
}

export default new NewController()
