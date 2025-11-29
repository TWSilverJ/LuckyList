import { json } from '@sveltejs/kit';
import { Item, SelectionHistory } from '$lib/server/db';
import type { RequestHandler } from './$types';

// 隨機選擇項目
export const POST: RequestHandler = async ({ params }) => {
    try {
        // 取得所有項目
        const items = await Item.findAll({
            where: { listId: params.id }
        });

        if (items.length === 0) {
            return json({ success: false, error: '清單中沒有項目' }, { status: 400 });
        }

        // 根據權重隨機選擇
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        let selectedItem: Item | null = null;

        for (const item of items) {
            random -= item.weight;
            if (random <= 0) {
                selectedItem = item;
                break;
            }
        }

        if (!selectedItem) {
            selectedItem = items[items.length - 1];
        }

        // 記錄選取歷程
        await SelectionHistory.create({
            listId: parseInt(params.id),
            itemId: selectedItem.id
        });

        return json({ success: true, data: selectedItem });
    } catch (error) {
        console.error('Error selecting random item:', error);
        return json({ success: false, error: '無法隨機選擇' }, { status: 500 });
    }
};

// 取得選取歷程
export const GET: RequestHandler = async ({ params, url }) => {
    try {
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        const { count, rows } = await SelectionHistory.findAndCountAll({
            where: { listId: params.id },
            include: [
                {
                    model: Item,
                    attributes: ['name']
                }
            ],
            order: [['selectedAt', 'DESC']],
            limit,
            offset
        });

        // 轉換資料格式以包含 item_name
        const data = rows.map((row) => ({
            id: row.id,
            listId: row.listId,
            itemId: row.itemId,
            selectedAt: row.selectedAt,
            item_name: row.item?.name || null
        }));

        return json({
            success: true,
            data,
            total: count
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        return json({ success: false, error: '無法取得歷程' }, { status: 500 });
    }
};
