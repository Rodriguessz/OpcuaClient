import { OpcuaController } from "../controllers/OpcuaController";
import { Router } from "express";

const opcuaController: OpcuaController = new OpcuaController();
console.log('OpcuaController instance created');

export const opcuaRoutes = Router();

//Connect and disconnect routes for the OPC UA server
opcuaRoutes.post('/connect', opcuaController.connect);
opcuaRoutes.post('/disconnect', opcuaController.disconnect);

//Browse tree route for the OPC UA server
opcuaRoutes.post('/browse', opcuaController.browseTree);
opcuaRoutes.post('/read', opcuaController.readNode);





    
