import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'
import New from './New'
import User from './User'

class Comment extends Model {
  declare id: number
  declare idNew: number
  declare idUser1: number
  declare idUser2: number
  declare createdAt: Date
  declare updatedAt: Date
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    idNew: {
      type: DataTypes.INTEGER,
      references: {
        model: New,
        key: 'id',
      },
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
    modelName: 'comment',
    tableName: 'comments',
  },
)

Comment.belongsTo(New, { foreignKey: 'idNew' })
Comment.belongsTo(User, { foreignKey: 'idUser1' })
Comment.belongsTo(User, { foreignKey: 'idUser2' })

Comment.addHook('afterCreate', async (comment: Comment, options: any) => {
  comment.dataValues.id = comment.id
})

export default Comment
