import { OpcuaService } from "../services/OpcuaService"

export class OpcuaController {

    private opcuaService: OpcuaService;

    constructor() {
        this.opcuaService = new OpcuaService();
    }

    connect = async (req: any, res: any) => {
        const { endpointUrl, servername } = req.body;

        const session = await this.opcuaService.connect(endpointUrl);

        res.status(200).json({ ...session, servername });
    }

    disconnect = async (req: any, res: any) => {
        await this.opcuaService.disconnect();
        res.status(200).json({ message: 'Desconectado do servidor OPC UA' });
    }

    mapFolder = async (req: any, res: any) => {
        const { folderNodeId } = req.body;

        if (!folderNodeId) {
            throw new Error('O parâmetro folderNodeId é obrigatório no body.');
        }

        if (!this.opcuaService.isConnected) {
            throw new Error('Sessão OPC UA não estabelecida. Conecte-se primeiro.');
        }

        // Como usamos Express 5, não precisa de try/catch
        const variables = await this.opcuaService.mapVariables(folderNodeId);

        return res.status(200).json({
            rootFolder: folderNodeId,
            totalVariables: variables.length,
            variables: variables
        });
    }

    search = async (req: any, res: any) => {
    const { query } = req.body; // Ex: "BM5"

    if (!query) {
        throw new Error('O parâmetro query é obrigatório.');
    }

    // Chama a busca na memória (não tem await porque é síncrono e instantâneo)
    const resultados = this.opcuaService.searchNodes(query);

    return res.status(200).json({
        termoBuscado: query,
        totalEncontrado: resultados.length,
        resultados: resultados
    });
}

}