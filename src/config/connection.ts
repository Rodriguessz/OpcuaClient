import { MessageSecurityMode, SecurityPolicy } from "node-opcua";
import * as path from "path";

const certFolder = path.parse(process.cwd()).root;


export const ConnectionConfig = {
    connectionStrategy: {
        initialDelay: 1000,
        maxRetry: 1,
        maxDelay: 5000,
    },
    endpointMustExist: false,
    SecurityPolicy: SecurityPolicy.None,
    MessageSecurityMode: MessageSecurityMode.None,
    keepSessionAlive: true,
    // certificateFile: path.join(certFolder, '/certs')
};  