import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'

class Category extends Model {
  declare id: number
  declare name: string
  declare createdAt: Date
  declare updatedAt: Date
}

Category.init(
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
    modelName: 'category',
    tableName: 'categories'
  },
)

Category.addHook('afterCreate', async (category: Category) => {
  category.dataValues.id = category.id
})

export default Category
