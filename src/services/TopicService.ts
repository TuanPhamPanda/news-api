import { cloudinary } from '../configs'
import {
  internalSeverDatabase,
  notFoundDatabase,
  responseFindDatabase,
} from '../containers'
import { Topic } from '../models'
import Service from './Service'

class TopicService implements Service<Topic> {
  getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const topics = await Topic.findAll()
        resolve(responseFindDatabase({ err: 0, response: { topics: topics } }))
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }
  getById(id: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const topic = await Topic.findByPk(id)
        if (topic) {
          resolve(responseFindDatabase({ response: { topic: topic } }))
        } else {
          resolve(notFoundDatabase('topics', id))
        }
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }

  create(data: Topic) {
    return new Promise(async (resolve, reject) => {
      try {
        const [topicData, created] = await Topic.findOrCreate({
          where: { title: data.title },
          defaults: data.dataValues,
        })

        if (!created) {
          await cloudinary.uploader.destroy(data.filename)
        }

        resolve(
          responseFindDatabase({
            response: created ? { category: topicData.dataValues } : null,
            msg: created
              ? 'Create topic successfully'
              : 'Topic title already exists',
            err: created ? 0 : 1,
          }),
        )
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }

  delete(id: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const existingTopic = await Topic.findByPk(id)
        if (existingTopic) {
          await cloudinary.uploader.destroy(existingTopic.filename)
          await existingTopic.destroy()
          resolve(
            responseFindDatabase({
              msg: `Delete topic successfully with id: ${id}`,
            }),
          )
        } else {
          resolve(notFoundDatabase('topics', id))
        }
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }

  update(id: number, data: Topic) {
    return new Promise(async (resolve, reject) => {
      try {
        const existingTopic = await Topic.findByPk(id)
        if (!existingTopic) {
          if (data.filename) {
            await cloudinary.uploader.destroy(data.filename)
          }

          resolve(notFoundDatabase('topics', id))
        } else {
          const [affectedRows] = await Topic.update(data.dataValues, {
            where: { id },
          })

          if (affectedRows > 0) {
            const topicData = await Topic.findByPk(id)

            if (existingTopic.filename !== data.filename) {
              await cloudinary.uploader.destroy(existingTopic.filename)
            }

            resolve(
              responseFindDatabase({
                msg: `Topic with id ${id} updated successfully.`,
                response: { topic: topicData },
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
                msg: `No topic found with ID ${id} or no changes were made.`,
              }),
            )
          }
        }
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }
}

export default new TopicService()
