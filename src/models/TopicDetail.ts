import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'
import Role from './Role'
import Topic from './Topic'
import User from './User'

class TopicDetail extends Model {
  declare id: number
  declare idUser: number
  declare idTopic: number
  declare isSaved: boolean
  declare createdAt: Date
  declare updatedAt: Date
}

TopicDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isSaved: {
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
    idTopic: {
      type: DataTypes.INTEGER,
      references: {
        model: Topic,
        key: 'id',
      },
    },
    idUser: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'topic_detail',
    tableName: 'topic_details',
  },
)

TopicDetail.belongsTo(Topic, { foreignKey: 'idTopic' })
TopicDetail.belongsTo(User, { foreignKey: 'idUser' })

TopicDetail.addHook(
  'afterCreate',
  async (topicDetail: TopicDetail, options: any) => {
    topicDetail.dataValues.id = topicDetail.id
  },
)

export default TopicDetail
