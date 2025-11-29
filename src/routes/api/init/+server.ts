import { json } from '@sveltejs/kit';
import { initDatabase } from '$lib/server/db';
import type { RequestHandler } from './$types';

// 初始化資料庫
export const POST: RequestHandler = async () => {
    try {
        await initDatabase();
        return json({ success: true, message: '資料庫初始化完成' });
    } catch (error) {
        console.error('Database init error:', error);
        return json({ success: false, error: '資料庫初始化失敗' }, { status: 500 });
    }
};
