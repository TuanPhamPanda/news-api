import {
  internalSeverDatabase,
  notFoundDatabase,
  responseFindDatabase,
} from '../containers'
import { Role } from '../models'
import Service from './Service'

class RoleService implements Service<Role> {
  getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const roles = await Role.findAll()
        resolve(responseFindDatabase({ err: 0, response: { roles } }))
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }

  getById(id: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const role = await Role.findByPk(id)
        if (role) {
          resolve(responseFindDatabase({ response: { role: role } }))
        } else {
          resolve(notFoundDatabase('roles', id))
        }
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }

  create(data: Role) {
    return new Promise(async (resolve, reject) => {
      try {
        const [roleData, created] = await Role.findOrCreate({
          where: { name: data.name },
          defaults: data.dataValues,
        })

        resolve(
          responseFindDatabase({
            response: created ? { role: roleData.get({ plain: true }) } : null,
            msg: created
              ? 'Create role successfully'
              : 'Role name already exists',
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
        const existingRole = await Role.findByPk(id)
        if (existingRole) {
          await existingRole.destroy()
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
  update(id: number, data: Role) {
    return new Promise(async (resolve, reject) => {
      try {
        const existingRole = await Role.findByPk(id)

        if (existingRole) {
          const [affectedRows] = await Role.update(data.dataValues, {
            where: { id },
          })

          if (affectedRows > 0) {
            const roleData = await Role.findByPk(id)
            resolve(
              responseFindDatabase({
                msg: `Role with id ${id} updated successfully.`,
                response: { role: roleData },
                err: 0,
              }),
            )
          } else {
            resolve(
              responseFindDatabase({
                err: 1,
                msg: `No role found with ID ${id} or no changes were made.`,
              }),
            )
          }
        } else {
          resolve(
            responseFindDatabase({
              err: 1,
              msg: `No role found with ID ${id}.`,
            }),
          )
        }
      } catch (error: any) {
        reject(internalSeverDatabase(error.message))
      }
    })
  }
}

export default new RoleService()
