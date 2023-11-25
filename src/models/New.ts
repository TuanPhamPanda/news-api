import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'
import Category from './Category'
import Topic from './Topic'
import User from './User'

class New extends Model {
    declare id: number
    declare title: string
    declare view: number
    declare summary: string
    declare image: string
    declare filename: string
    declare slug: string
    declare content: string
    declare status: boolean
    declare idCategory: number
    declare idTopic: number
    declare idUser: number
    declare createdAt: Date
    declare updatedAt: Date
}

New.init(
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
        view: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        summary: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        idCategory: {
            type: DataTypes.INTEGER,
            references: {
                model: Category,
                key: 'id',
            },
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
        modelName: 'new',
        tableName: 'news',
    },
)

New.belongsTo(Topic, { foreignKey: 'idTopic' })
New.belongsTo(User, { foreignKey: 'idUser' })
New.belongsTo(Category, { foreignKey: 'idCategory' })

New.addHook('afterCreate', async (newData: New, options: any) => {
    newData.dataValues.id = newData.id
})

export default New
