import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'

class Google extends Model {
  declare id: number
  declare iss: string
  declare nbf: string
  declare aud: string
  declare sub: string
  declare email: string
  declare email_verified: string
  declare azp: string
  declare name: string
  declare given_name: string
  declare family_name: string
  declare iat: string
  declare exp: string
  declare jti: string

  declare createdAt: Date
  declare updatedAt: Date
}

Google.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    iss: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nbf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aud: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_verified: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    azp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    given_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    family_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jti: {
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
    modelName: 'google',
    tableName: 'googles',
  },
)

Google.addHook('afterCreate', async (google: Google, options: any) => {
  google.dataValues.id = google.id
})

export default Google
