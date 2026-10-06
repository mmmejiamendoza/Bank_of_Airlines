export interface ApiError {
    code: string;
    message: string;
}

export interface ApiReponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
}