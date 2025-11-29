import { json } from '@sveltejs/kit';
import { List, Item } from '$lib/server/db';
import type { RequestHandler } from './$types';

// 取得清單的所有項目
export const GET: RequestHandler = async ({ params }) => {
    try {
        const items = await Item.findAll({
            where: { listId: params.id },
            order: [['createdAt', 'ASC']]
        });
        return json({ success: true, data: items });
    } catch (error) {
        console.error('Error fetching items:', error);
        return json({ success: false, error: '無法取得項目' }, { status: 500 });
    }
};

// 新增項目到清單
export const POST: RequestHandler = async ({ params, request }) => {
    try {
        const { name, weight } = await request.json();

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return json({ success: false, error: '項目名稱為必填' }, { status: 400 });
        }

        // 確認清單存在
        const list = await List.findByPk(params.id);

        if (!list) {
            return json({ success: false, error: '清單不存在' }, { status: 404 });
        }

        const item = await Item.create({
            listId: parseInt(params.id),
            name: name.trim(),
            weight: weight || 1
        });

        return json({ success: true, data: item }, { status: 201 });
    } catch (error) {
        console.error('Error creating item:', error);
        return json({ success: false, error: '無法新增項目' }, { status: 500 });
    }
};
