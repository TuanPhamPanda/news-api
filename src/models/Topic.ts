import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'

class Topic extends Model {
  declare id: number
  declare title: string
  declare description: string
  declare image: string
  declare createdAt: Date
  declare updatedAt: Date
}

Topic.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
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
    modelName: 'topic',
    tableName: 'topics',
  },
)

Topic.addHook('afterCreate', async (topic: Topic) => {
  topic.dataValues.id = topic.id
})

export default Topic
