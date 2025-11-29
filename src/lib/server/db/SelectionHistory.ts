import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import { Item } from './Item';
import { List } from './List';
import sequelize from './sequelize';

// 選取歷程模型
class SelectionHistory extends Model<InferAttributes<SelectionHistory>, InferCreationAttributes<SelectionHistory>> {
    declare id: CreationOptional<number>;
    declare listId: ForeignKey<List['id']>;
    declare itemId: ForeignKey<Item['id']>;
    declare selectedAt: CreationOptional<Date>;

    // 關聯查詢時的虛擬欄位
    declare item?: Item;
}

SelectionHistory.init(
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
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'item_id',
            references: {
                model: Item,
                key: 'id'
            }
        },
        selectedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'selected_at'
        }
    },
    {
        sequelize,
        tableName: 'selection_history',
        timestamps: false
    }
);

// 設定關聯
List.hasMany(SelectionHistory, { foreignKey: 'listId', onDelete: 'CASCADE' });
SelectionHistory.belongsTo(List, { foreignKey: 'listId' });

Item.hasMany(SelectionHistory, { foreignKey: 'itemId', onDelete: 'CASCADE' });
SelectionHistory.belongsTo(Item, { foreignKey: 'itemId' });

export { SelectionHistory };
