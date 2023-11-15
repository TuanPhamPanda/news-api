import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'
import User from './User'

class Follow extends Model {
  declare id: number
  declare idUser1: number
  declare idUser2: number
  declare isFollow: boolean
  declare createdAt: Date
  declare updatedAt: Date
}

Follow.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isFollow: {
      type: DataTypes.BOOLEAN,
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

    idUser1: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },

    idUser2: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'follow',
    tableName: 'follows',
  },
)

Follow.belongsTo(User, { foreignKey: 'idUser1' })
Follow.belongsTo(User, { foreignKey: 'idUser2' })

Follow.addHook('afterCreate', async (follow: Follow, options: any) => {
  follow.dataValues.id = follow.id
})

export default Follow
