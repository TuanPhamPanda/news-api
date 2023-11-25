import { Model, DataTypes } from 'sequelize'
import sequelize from './Sequelize'
import Role from './Role'

class User extends Model {
    declare id: number
    declare bio: string
    declare phoneNumber: string
    declare fullName: string
    declare idRole: number
    declare image: string
    declare website: string
    declare createdAt: Date
    declare updatedAt: Date
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: { len: [10, 10] },
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
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

        idRole: {
            type: DataTypes.INTEGER,
            references: {
                model: Role,
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'user',
        tableName: 'users',
    },
)

User.belongsTo(Role, { foreignKey: 'idRole' })

User.addHook('afterCreate', async (user: User, options: any) => {
    user.dataValues.id = user.id
})

export default User
