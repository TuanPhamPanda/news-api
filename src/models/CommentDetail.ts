import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'
import Comment from './Comment'

class CommentDetail extends Model {
  declare id: number
  declare idComment: number
  declare content: string
  declare liked: boolean
  declare status: boolean
  declare createdAt: Date
  declare updatedAt: Date
}

CommentDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    liked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    idComment: {
      type: DataTypes.INTEGER,
      references: {
        model: Comment,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'comment_detail',
    tableName: 'comment_details',
  },
)

CommentDetail.belongsTo(Comment, { foreignKey: 'idComment' })

CommentDetail.addHook('afterCreate', async (commentDetail: CommentDetail, options: any) => {
  commentDetail.dataValues.id = commentDetail.id
})

export default CommentDetail
