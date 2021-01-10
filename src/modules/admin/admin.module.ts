import { Logger, Module, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AdminController } from "./admin.controller";

@Module({
    imports: [
        ServeStaticModule.forRoot({ 
            rootPath: join(__dirname, '..', 'admin/front-end'), 
            renderPath: "/admin"
          })
    ],
    providers: [],
    controllers: [AdminController]
})
export class AdminModule  {


}