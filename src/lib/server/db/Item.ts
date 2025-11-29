import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { List } from './List';
import sequelize from './sequelize';

// 項目模型
class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
    declare id: CreationOptional<number>;
    declare listId: ForeignKey<List['id']>;
    declare name: string;
    declare weight: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
}

Item.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        listId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'list_id',
            references: {
                model: List,
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        }
    },
    {
        sequelize,
        tableName: 'items',
        timestamps: true,
        updatedAt: false
    }
);

// 設定關聯
List.hasMany(Item, { foreignKey: 'listId', onDelete: 'CASCADE' });
Item.belongsTo(List, { foreignKey: 'listId' });

export { Item };
