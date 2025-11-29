import { Sequelize } from 'sequelize';
import { env } from '$env/dynamic/private';

// 建立 Sequelize 實例
const sequelize = new Sequelize({
    dialect: 'mariadb',
    host: env.DB_HOST || 'localhost',
    port: parseInt(env.DB_PORT || '3306'),
    username: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'lucky_list',
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export default sequelize;
