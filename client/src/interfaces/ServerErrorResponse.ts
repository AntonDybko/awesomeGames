export interface ServerErrorResponse {
    response: {
        data: {
            message: string,
            details: string,
            criteria?: string[]
        }
    }
}
