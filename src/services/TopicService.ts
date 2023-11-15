import { internalSeverDatabase, responseFindDatabase } from '../containers'
import { Topic } from '../models'
import Service from './Service'

class TopicService implements Service<Topic> {
  getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const topics = await Topic.findAll()
        resolve(responseFindDatabase({ err: 0, response: topics }))
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }
  getById(id: number) {
    return new Promise((resolve, reject) => {
      try {
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }
  create(data: Topic) {
    return new Promise((resolve, reject) => {
      try {
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }
  delete(id: number) {
    return new Promise((resolve, reject) => {
      try {
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }
  update(id: number, data: Topic) {
    return new Promise((resolve, reject) => {
      try {
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }
}

export default new TopicService()
