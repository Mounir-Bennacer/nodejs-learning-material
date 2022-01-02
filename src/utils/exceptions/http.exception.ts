class HttpException extends Error {
    public message: string
    public status: number

    constructor(message: string, statusCode: number) {
        super(message);
        this.message = message;
        this.status = statusCode;
    }
}

export default HttpException;
