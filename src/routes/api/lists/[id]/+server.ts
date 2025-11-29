import { json } from '@sveltejs/kit';
import { List } from '$lib/server/db';
import type { RequestHandler } from './$types';

// 取得單一清單
export const GET: RequestHandler = async ({ params }) => {
    try {
        const list = await List.findByPk(params.id);

        if (!list) {
            return json({ success: false, error: '清單不存在' }, { status: 404 });
        }

        return json({ success: true, data: list });
    } catch (error) {
        console.error('Error fetching list:', error);
        return json({ success: false, error: '無法取得清單' }, { status: 500 });
    }
};

// 更新清單
export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const { name, description } = await request.json();

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return json({ success: false, error: '清單名稱為必填' }, { status: 400 });
        }

        const list = await List.findByPk(params.id);

        if (!list) {
            return json({ success: false, error: '清單不存在' }, { status: 404 });
        }

        await list.update({
            name: name.trim(),
            description: description || null
        });

        return json({ success: true, data: list });
    } catch (error) {
        console.error('Error updating list:', error);
        return json({ success: false, error: '無法更新清單' }, { status: 500 });
    }
};

// 刪除清單
export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const deleted = await List.destroy({
            where: { id: params.id }
        });

        if (deleted === 0) {
            return json({ success: false, error: '清單不存在' }, { status: 404 });
        }

        return json({ success: true });
    } catch (error) {
        console.error('Error deleting list:', error);
        return json({ success: false, error: '無法刪除清單' }, { status: 500 });
    }
};
