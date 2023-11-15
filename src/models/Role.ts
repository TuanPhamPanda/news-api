import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'

class Role extends Model {
  declare id: number
  declare name: string
  declare description: string
  declare createdAt: Date
  declare updatedAt: Date
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'role',
    tableName: 'roles',
  },
)

Role.addHook('afterCreate', async (role: Role) => {
  role.dataValues.id = role.id
})

export default Role
