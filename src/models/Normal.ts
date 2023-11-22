import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'

class Normal extends Model {
    declare id: number
    declare username: string
    declare password: string
    declare image: string
    declare refreshToken: string
    declare createdAt: Date
    declare updatedAt: Date
}

Normal.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true,
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
        modelName: 'normal',
        tableName: 'normals',
    },
)

Normal.addHook('afterCreate', async (normal: Normal) => {
    normal.dataValues.id = normal.id
})

export default Normal
