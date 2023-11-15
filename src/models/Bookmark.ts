import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'
import Role from './Role'
import User from './User'
import New from './New'

class Bookmark extends Model {
  declare id: number
  declare idUser: number
  declare idNew: number
  declare createdAt: Date
  declare updatedAt: Date
}

Bookmark.init(
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
    modelName: 'Bookmark',
    tableName: 'Bookmarks',
  },
)

Bookmark.belongsTo(User, { foreignKey: 'idUser' })
Bookmark.belongsTo(New, { foreignKey: 'idNew' })

Bookmark.addHook('afterCreate', async (bookmark: Bookmark, options: any) => {
  bookmark.dataValues.id = bookmark.id
})

export default Bookmark
