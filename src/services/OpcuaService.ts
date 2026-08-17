import { OPCUAClient, ClientSession, AttributeIds, SecurityPolicy, MessageSecurityMode, AddressSpace, BrowseResult } from 'node-opcua';
import { ConnectionConfig } from '../config/connection';

export class OpcuaService {
    private client: OPCUAClient;
    private session: ClientSession | null = null;
    isConnected: boolean = false;

    constructor() {
        this.client = OPCUAClient.create({
            endpointMustExist: false,
            connectionStrategy: ConnectionConfig.connectionStrategy,
            securityPolicy: SecurityPolicy.None,
            securityMode: MessageSecurityMode.None,
            applicationName: 'MyOpcuaClient',
            keepSessionAlive: true,

        });
    }

    //Method to connect to the OPCUA server and create a session.
    async connect(endpointUrl: string): Promise<Object> {
        try {
            //Open the connection with the OPCUA server.
            await this.client.connect(endpointUrl);
            //Creates a new session with the OPCUA server.
            this.session = await this.client.createSession();
            this.isConnected = true;
            
            const session = {
                sessionId: this.session.sessionId.toString(),
                endpointUrl: endpointUrl,
                loggedTime: new Date().toLocaleString("pt-BR"),
            }

            return session;

        } catch (error) {
            console.error('[OPC UA] Falha ao conectar:"', error);
            throw error;
        }
    }

    //Method to disconnect from the OPCUA server and close the session.
    async disconnect(): Promise<void> {
        try {
            if (this.session) {
                this.session.close();
                this.session = null;
            }
            this.isConnected = false;
        } catch (error) {
            console.error('[OPC UA] Falha ao desconectar:"', error);
        }
    }

    async browseTree(treeName: string): Promise<BrowseResult> {
        console.log('Browsing tree:', treeName);

        if (!this.isConnected || !this.session) {
            throw new Error('Not connected to OPC UA server or session is not established.');
        }

        const browseResult = await this.session.browse(treeName);
        return browseResult
    }

}

