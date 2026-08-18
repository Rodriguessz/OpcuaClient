import { OPCUAClient, ClientSession, BrowseResult, DataValue, AttributeIds, NodeClass, ReadValueId, ReadValueIdOptions } from 'node-opcua';
import { ConnectionConfig } from '../config/connection';

export class OpcuaService {
    private client: OPCUAClient;
    private session: ClientSession | null = null;
    public nodesCache: any[] = [];
    public isConnected: boolean = false;
    

    constructor() {
        this.client = OPCUAClient.create(ConnectionConfig);
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

    async mapVariables(startNodeId: string): Promise<[]> {
        if (!this.isConnected || !this.session) {
            throw new Error("Sessão OPC UA não estabelecida.");
        }

        const variablesFound: any[] = [];
        const visitedNodes = new Set(); // Proteção contra loop infinito

        // Arrow function interna recursiva
        const crawl = async (nodeId: string) => {
            // Se já visitamos esse Node, sai fora para evitar loop
            if (visitedNodes.has(nodeId)) return;
            visitedNodes.add(nodeId);

            try {
                const browseResult = await this.session!.browse(nodeId);
                const references = browseResult.references || [];

                for (const ref of references) {
                    // Só queremos seguir adiante na árvore (filhos), não queremos voltar pros pais
                    if (!ref.isForward) continue;

                    const childNodeId = ref.nodeId.toString();

                    // Se for Variável, achamos o que queríamos! Salva no array.
                    if (ref.nodeClass === NodeClass.Variable) {
                        variablesFound.push({
                            browseName: ref.browseName.name,
                            nodeId: childNodeId
                        });
                    }
                    // Se for Pasta (Object), chamamos a função novamente para entrar nela
                    else if (ref.nodeClass === NodeClass.Object) {
                        await crawl(childNodeId);
                    }
                }
            } catch (error) {
                console.warn(`[OPC UA] Aviso: Sem permissão para ler o nó ${nodeId}. Pulando...`);
            }
        };

        console.log(`[OPC UA] Iniciando mapeamento a partir de: ${startNodeId}...`);

        // Dispara a primeira busca
        await crawl(startNodeId);

        console.log(`[OPC UA] Mapeamento concluído! ${variablesFound.length} variáveis encontradas.`);
        this.nodesCache = variablesFound;
        return variablesFound;
    }

    searchNodes(query: string): any[] {
        if (this.nodesCache.length === 0) {
            throw new Error("O cache está vazio. Execute o mapeamento primeiro.");
        }

        // Transforma a busca em minúscula para não ter problema com maiúsculas/minúsculas
        const termo = query.toLowerCase();

        // Filtra o array na velocidade da luz
        return this.nodesCache.filter(node => 
            node.browseName.toLowerCase().includes(termo)
        );
    }

}

