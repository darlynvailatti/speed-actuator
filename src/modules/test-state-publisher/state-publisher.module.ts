import { Module } from "@nestjs/common";
import { StateUpdateListenerService } from "./state-update-listener.service";
import { ExecutionStateGateway } from "src/modules/test-state-publisher/execution-state-ws.service";
import { DatabaseModule } from "../database/database.module";


@Module({
    imports: [DatabaseModule],
    controllers: [],
    providers: [StateUpdateListenerService, ExecutionStateGateway]
})
export class StatePublisherModule { }