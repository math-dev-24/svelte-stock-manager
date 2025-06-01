export type ServerResponse<T>  = {
    success: true;
    data: T;
    message?: string;
} | {
    success: false;
    errorCode: Code;
    message: string;
}

export type Code = 'VALIDATION_ERROR' | 'SERVER_ERROR';