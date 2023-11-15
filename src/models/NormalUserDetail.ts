import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'
import User from './User'
import Normal from './Normal'

class NormalUserDetail extends Model {
  declare id: number
  declare idUser: number
  declare idNormal: number
  declare createdAt: Date
  declare updatedAt: Date
}

NormalUserDetail.init(
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
    idNormal: {
      type: DataTypes.INTEGER,
      references: {
        model: Normal,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'normal_user_detail',
    tableName: 'normal_user_details',
  },
)

NormalUserDetail.belongsTo(User, { foreignKey: 'idUser' })
NormalUserDetail.belongsTo(Normal, { foreignKey: 'idNormal' })

NormalUserDetail.addHook(
  'afterCreate',
  async (normalUserDetail: NormalUserDetail) => {
    normalUserDetail.dataValues.id = normalUserDetail.id
  },
)

export default NormalUserDetail
