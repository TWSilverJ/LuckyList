import sequelize from './sequelize';
import { Item } from './Item';
import { List } from './List';
import { SelectionHistory } from './SelectionHistory';

// 初始化資料庫
async function initDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // 同步所有模型（建立資料表）
        await sequelize.sync();
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

// 匯出 Sequelize 實例
export { sequelize };

// 匯出所有模型
export { Item, List, SelectionHistory };

// 匯出初始化函數
export { initDatabase };
