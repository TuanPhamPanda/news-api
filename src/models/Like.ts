import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'
import Role from './Role'
import User from './User'
import New from './New'

class Like extends Model {
  declare id: number
  declare idUser: number
  declare idNew: number
  declare isLiked: boolean
  declare createdAt: Date
  declare updatedAt: Date
}

Like.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    isLiked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    idUser: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },

    idNew: {
      type: DataTypes.INTEGER,
      references: {
        model: New,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'like',
    tableName: 'likes',
  },
)

Like.belongsTo(User, { foreignKey: 'idUser' })
Like.belongsTo(New, { foreignKey: 'idNew' })

Like.addHook('afterCreate', async (like: Like, options: any) => {
  like.dataValues.id = like.id
})

export default Like
