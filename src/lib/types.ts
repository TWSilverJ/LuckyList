// 清單類型（前端使用）
export interface List {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

// 項目類型（前端使用）
export interface Item {
    id: number;
    listId: number;
    name: string;
    weight: number;
    createdAt: string;
}

// 選取歷程類型（前端使用）
export interface SelectionHistory {
    id: number;
    listId: number;
    itemId: number;
    selectedAt: string;
    item_name?: string | null;
}

// API 回應類型
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    total?: number;
}
