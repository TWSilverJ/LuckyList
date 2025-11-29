import { json } from '@sveltejs/kit';
import { Item } from '$lib/server/db';
import type { RequestHandler } from './$types';

// 更新項目
export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const { name, weight } = await request.json();

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return json({ success: false, error: '項目名稱為必填' }, { status: 400 });
        }

        const item = await Item.findOne({
            where: { id: params.itemId, listId: params.id }
        });

        if (!item) {
            return json({ success: false, error: '項目不存在' }, { status: 404 });
        }

        await item.update({
            name: name.trim(),
            weight: weight || 1
        });

        return json({ success: true, data: item });
    } catch (error) {
        console.error('Error updating item:', error);
        return json({ success: false, error: '無法更新項目' }, { status: 500 });
    }
};

// 刪除項目
export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const deleted = await Item.destroy({
            where: { id: params.itemId, listId: params.id }
        });

        if (deleted === 0) {
            return json({ success: false, error: '項目不存在' }, { status: 404 });
        }

        return json({ success: true });
    } catch (error) {
        console.error('Error deleting item:', error);
        return json({ success: false, error: '無法刪除項目' }, { status: 500 });
    }
};
