import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'
import Google from './Google'
import User from './User'

class GoogleUserDetail extends Model {
  declare id: number
  declare idUser: number
  declare idGoogle: number
  declare createdAt: Date
  declare updatedAt: Date
}

GoogleUserDetail.init(
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
    idGoogle: {
      type: DataTypes.INTEGER,
      references: {
        model: Google,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'google_user_detail',
    tableName: 'google_user_details',
  },
)

GoogleUserDetail.belongsTo(User, { foreignKey: 'idUser' })
GoogleUserDetail.belongsTo(Google, { foreignKey: 'idGoogle' })

GoogleUserDetail.addHook(
  'afterCreate',
  async (googleUserDetail: GoogleUserDetail) => {
    googleUserDetail.dataValues.id = googleUserDetail.id
  },
)

export default GoogleUserDetail
