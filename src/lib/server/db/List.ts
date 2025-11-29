import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';

// 清單模型
class List extends Model<InferAttributes<List>, InferCreationAttributes<List>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare description: string | null;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

List.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    {
        sequelize,
        tableName: 'lists',
        timestamps: true
    }
);

export { List };
