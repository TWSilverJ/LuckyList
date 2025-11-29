import { json } from '@sveltejs/kit';
import { List } from '$lib/server/db';
import type { RequestHandler } from './$types';

// 取得所有清單
export const GET: RequestHandler = async () => {
    try {
        const lists = await List.findAll({
            order: [['updatedAt', 'DESC']]
        });
        return json({ success: true, data: lists });
    } catch (error) {
        console.error('Error fetching lists:', error);
        return json({ success: false, error: '無法取得清單' }, { status: 500 });
    }
};

// 建立新清單
export const POST: RequestHandler = async ({ request }) => {
    try {
        const { name, description } = await request.json();

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return json({ success: false, error: '清單名稱為必填' }, { status: 400 });
        }

        const list = await List.create({
            name: name.trim(),
            description: description || null
        });

        return json({ success: true, data: list }, { status: 201 });
    } catch (error) {
        console.error('Error creating list:', error);
        return json({ success: false, error: '無法建立清單' }, { status: 500 });
    }
};
