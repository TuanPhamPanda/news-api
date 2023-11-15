import {
  internalSeverDatabase,
  notFoundDatabase,
  responseFindDatabase,
} from '../containers'
import { Category, Category as CategoryRepository } from '../models'
import Service from './Service'

class CategoryService implements Service<Category> {
  getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Category.findAll()
        resolve(responseFindDatabase({ response: { categories: response } }))
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }

  getById(id: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Category.findByPk(id)
        if (response) {
          resolve(responseFindDatabase({ response: { category: response } }))
        } else {
          resolve(notFoundDatabase('categories', id))
        }
      } catch (error: any) {
        console.log(error)

        reject(internalSeverDatabase(error.message))
      }
    })
  }

  update(id: number, category: Category) {
    return new Promise(async (resolve, reject) => {
      try {
        const existingCategory = await Category.findByPk(id)

        if (existingCategory) {
          const [affectedRows] = await Category.update(category.dataValues, {
            where: { id },
          })

          if (affectedRows > 0) {
            const categoryData = await Category.findByPk(id)
            resolve(
              responseFindDatabase({
                msg: `Category with id ${id} updated successfully.`,
                response: { category: categoryData },
                err: 0,
              }),
            )
          } else {
            resolve(
              responseFindDatabase({
                err: 1,
                msg: `No category found with ID ${id} or no changes were made.`,
              }),
            )
          }
        } else {
          resolve(
            responseFindDatabase({
              err: 1,
              msg: `No category found with ID ${id}.`,
            }),
          )
        }
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }

  create(category: Category) {
    return new Promise(async (resolve, reject) => {
      try {
        const [categoryData, created] = await Category.findOrCreate({
          where: { name: category.name },
          defaults: { name: category.name },
        })

        resolve(
          responseFindDatabase({
            response: created
              ? { category: categoryData.get({ plain: true }) }
              : null,
            msg: created
              ? 'Create category successfully'
              : 'Category name already exists',
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
        const categoryById = await Category.findByPk(id)
        if (categoryById) {
          await categoryById.destroy()
          resolve(
            responseFindDatabase({
              msg: `Delete category successfully with id: ${id}`,
            }),
          )
        } else {
          resolve(notFoundDatabase('category', id))
        }
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }
}

export default new CategoryService()
