export declare class ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errorCode?: string;
    constructor(success: boolean, message: string, data?: T, errorCode?: string);
    static success<T>(data?: T): ApiResponse<T>;
    static successWithMessage<T>(message: string, data?: T): ApiResponse<T>;
    static error<T>(message: string, errorCode?: string): ApiResponse<T>;
}
