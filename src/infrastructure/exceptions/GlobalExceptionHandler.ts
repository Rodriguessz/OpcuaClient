export class GlobalExceptionHandler {

    static handleError(error: Error, req: any, res: any, next: any) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Erro interno no servidor'
        });
    }

}