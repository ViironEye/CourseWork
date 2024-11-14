class HttpException {
    constructor(
        private readonly statusCode: number,
        private readonly message?: string,
    ) {}
    public toString(): string {
        return JSON.stringify(
            {
                ok: false,
                statusCode: this.statusCode,
                message: this.message,
            },
            null,
        );
    }
}

export default HttpException;
