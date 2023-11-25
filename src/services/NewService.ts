import { Op } from 'sequelize'
import {
    INewsAllParams,
    notFoundDatabase,
    responseFindDatabase,
} from '../containers'
import { Category, New, Role, Topic, User } from '../models'
import Service from './Service'
import { cloudinary } from '../configs'

class NewService implements Service<New> {
    getAll() {
        return new Promise(async (resolve, reject) => {
            try {
                const news = await New.findAll({
                    order: [['updatedAt', 'DESC']],
                })
                return resolve(responseFindDatabase({ err: 1, response: news }))
            } catch (error: any) {
                return reject(responseFindDatabase({ err: 1, msg: error }))
            }
        })
    }

    getAllNews({
        orderType = 'recent',
        limit = 10,
        author,
        category,
        topic,
    }: INewsAllParams) {
        return new Promise(async (resolve, reject) => {
            try {
                const news = await New.findAll({
                    where: {
                        status: true,
                        ...(author && { idUser: author.authorId }),
                        ...(category && { idCategory: category.categoryId }),
                        ...(topic && { idTopic: topic.topicId }),
                    },
                    limit,
                    order: [
                        [orderType === 'recent' ? 'updatedAt' : 'view', 'DESC'],
                    ],
                    attributes: {
                        exclude: [
                            'idUser',
                            'idCategory',
                            'idTopic',
                            'status',
                            'createdAt',
                            'content',
                        ],
                    },
                    include: [
                        {
                            model: User,
                            include: [
                                {
                                    model: Role,
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt'],
                                    },
                                },
                            ],
                            attributes: {
                                exclude: ['idRole', 'createdAt', 'updatedAt'],
                            },
                        },
                        {
                            model: Category,
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        },
                        {
                            model: Topic,
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        },
                    ],
                })
                resolve(responseFindDatabase({ err: 0, response: { news } }))
            } catch (error: any) {
                reject(responseFindDatabase({ err: 1, msg: error }))
            }
        })
    }

    getBySlug(slug: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const newData = await New.findOne({
                    where: { slug },
                    limit: 1,
                    attributes: {
                        exclude: [
                            'idUser',
                            'idCategory',
                            'idTopic',
                            'status',
                            'createdAt',
                            'content',
                        ],
                    },
                    include: [
                        {
                            model: User,
                            include: [
                                {
                                    model: Role,
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt'],
                                    },
                                },
                            ],
                            attributes: {
                                exclude: ['idRole', 'createdAt', 'updatedAt'],
                            },
                        },
                        {
                            model: Category,
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        },
                        {
                            model: Topic,
                            attributes: { exclude: ['createdAt', 'updatedAt'] },
                        },
                    ],
                })

                if (!newData) {
                    return resolve(
                        responseFindDatabase({
                            err: 1,
                            msg: `No news found with slug ${slug}`,
                        }),
                    )
                }

                return resolve(
                    responseFindDatabase({
                        err: 0,
                        response: { new: newData },
                    }),
                )
            } catch (error: any) {
                reject(responseFindDatabase({ err: 1, msg: error }))
            }
        })
    }

    getById(id: number) {
        return new Promise(async (resolve, reject) => {
            try {
            } catch (error: any) {
                reject(responseFindDatabase({ err: 1, msg: error }))
            }
        })
    }

    create(data: New) {
        return new Promise(async (resolve, reject) => {
            try {
                const existNewImage = await New.findOne({
                    where: { image: data.image, filename: data.filename },
                })

                if (existNewImage) {
                    return resolve(
                        responseFindDatabase({
                            err: 1,
                            msg: 'New image already exists',
                        }),
                    )
                }

                const existCategoryId = await Category.findByPk(data.idCategory)
                if (!existCategoryId) {
                    await cloudinary.uploader.destroy(data.filename)
                    return resolve(
                        notFoundDatabase('category', data.idCategory),
                    )
                }

                const existTopic = await Topic.findByPk(data.idTopic)
                if (!existTopic) {
                    await cloudinary.uploader.destroy(data.filename)
                    return resolve(notFoundDatabase('topic', data.idTopic))
                }

                const existAuthor = await User.findByPk(data.idUser)
                if (!existAuthor) {
                    await cloudinary.uploader.destroy(data.filename)
                    return resolve(notFoundDatabase('author', data.idUser))
                }

                const existTitleNew = await New.findOne({
                    where: { title: data.title },
                })
                if (existTitleNew) {
                    await cloudinary.uploader.destroy(data.filename)
                    return resolve(
                        responseFindDatabase({
                            err: 1,
                            msg: 'The title of the news already exists',
                        }),
                    )
                }

                const newData = await New.findOrCreate({
                    where: { title: data.title },
                    defaults: data.dataValues,
                })

                if (!newData[1]) {
                    cloudinary.uploader.destroy(data.filename)
                }

                resolve(
                    responseFindDatabase({
                        msg: newData[1]
                            ? 'New category successfully'
                            : 'New title already exists',
                        err: newData[1] ? 0 : 1,
                    }),
                )
            } catch (error: any) {
                reject(responseFindDatabase({ err: 1, msg: error }))
            }
        })
    }

    delete(id: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const existNew = await New.findByPk(id)
                if (existNew) {
                   await cloudinary.uploader.destroy(existNew.filename)
                    await existNew.destroy()
                    return resolve(
                        responseFindDatabase({
                            err: 0,
                            msg: `New with id ${id} updated successfully.`,
                        }),
                    )
                } else {
                    return resolve(notFoundDatabase('new', id))
                }
            } catch (error: any) {
                reject(responseFindDatabase({ err: 1, msg: error }))
            }
        })
    }

    update(id: number, data: New) {
        return new Promise(async (resolve, reject) => {
            try {
                const existNewById = await New.findByPk(id)
                if (!existNewById) {
                    await cloudinary.uploader.destroy(data.filename)
                    return resolve(notFoundDatabase('new', id))
                }

                if (data.idCategory) {
                    const existCategoryId = await Category.findByPk(
                        data.idCategory,
                    )
                    if (!existCategoryId) {
                        if (existNewById.filename !== data.filename)
                            await cloudinary.uploader.destroy(data.filename)

                        return resolve(
                            notFoundDatabase('category', data.idCategory),
                        )
                    }
                }

                if (data.idTopic) {
                    const existTopic = await Topic.findByPk(data.idTopic)
                    if (!existTopic) {
                        if (existNewById.filename !== data.filename)
                            await cloudinary.uploader.destroy(data.filename)
                        return resolve(notFoundDatabase('topic', data.idTopic))
                    }
                }

                if (data.idUser) {
                    const existAuthor = await User.findByPk(data.idUser)
                    if (!existAuthor) {
                        if (existNewById.filename !== data.filename)
                            await cloudinary.uploader.destroy(data.filename)
                        return resolve(notFoundDatabase('author', data.idUser))
                    }
                }

                const [affectedRows] = await New.update(data.dataValues, {
                    where: { id },
                })

                if (affectedRows > 0) {
                    const newData = await New.findByPk(id)

                    if (existNewById && newData) {
                        if (existNewById.filename !== newData.filename) {
                            await cloudinary.uploader.destroy(
                                existNewById.filename,
                            )
                        }
                    }

                    resolve(
                        responseFindDatabase({
                            msg: `New with id ${id} updated successfully.`,
                            response: { topic: newData },
                            err: 0,
                        }),
                    )
                } else {
                    if (data.filename) {
                        await cloudinary.uploader.destroy(data.filename)
                    }

                    resolve(
                        responseFindDatabase({
                            err: 1,
                            msg: `An error occurred while updating data`,
                        }),
                    )
                }
            } catch (error: any) {
                reject(responseFindDatabase({ err: 1, msg: error }))
            }
        })
    }
}

export default new NewService()
