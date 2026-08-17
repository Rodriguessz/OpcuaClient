import { Router } from "express";
import { opcuaRoutes } from './opcua.routes'



const routes = Router();

routes.use('/opcua', opcuaRoutes );


export default routes;