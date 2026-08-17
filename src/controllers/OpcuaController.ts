import { OpcuaService } from "../services/OpcuaService"

export class OpcuaController {

    private opcuaService: OpcuaService;

    constructor() {
        this.opcuaService = new OpcuaService();
    }

    connect = async (req: any, res: any) => {
        const { endpointUrl, servername } = req.body;

        if (this.opcuaService.isConnected) {
            return res.status(400).json({ message: 'Já conectado ao servidor OPC UA' });
        }
            
        const session = await this.opcuaService.connect(endpointUrl);
        console.log(this.opcuaService)
        
        res.status(200).json({...session, servername});
    } 


    disconnect = async (req: any, res: any) => {
        await this.opcuaService.disconnect();
        console.log(this.opcuaService)
        res.status(200).json({ message: 'Desconectado do servidor OPC UA' });
    }

    browseTree = async (req: any, res: any) => {
        const { treeName } = req.body;

        if (!this.opcuaService.isConnected) {
            throw new Error('Sessão OPC UA não estabelecida. Conecte-se primeiro.');
        }
        
        const browseResult = await this.opcuaService.browseTree(treeName);
        
        res.status(200).json(browseResult);
    }
}