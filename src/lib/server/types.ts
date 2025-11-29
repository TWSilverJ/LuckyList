// API 回應類型
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}
