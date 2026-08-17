import { OpcuaService } from "../services/OpcuaService"

export class OpcuaController {

    private opcuaService: OpcuaService;

    constructor() {
        this.opcuaService = new OpcuaService();
    }

    connect = async (req: any, res: any) => {
        const { endpointUrl, servername } = req.body;

        const session = await this.opcuaService.connect(endpointUrl);
        
        res.status(200).json({...session, servername});
    } 


    disconnect = async (req: any, res: any) => {
        await this.opcuaService.disconnect();
        res.status(200).json({ message: 'Desconectado do servidor OPC UA' });
    }

    browseTree = async (req: any, res: any) => {
        const { treeName } = req.body;

        const browseResult = await this.opcuaService.browseTree(treeName);
        
        res.status(200).json(browseResult);
    }

    readNode = async (req: any, res: any) => {
        const { nodeId } = req.body;

        const dataValue = await this.opcuaService.readNode(nodeId);

        res.status(200).json(dataValue);
    }
}