import { Logger } from "@nestjs/common";
import { Test } from "src/models/execution/test";
import { TestExecutionTurn, TestExecutionNode } from "src/models/execution/test.execution";

export class ProcessorGetCurrentTurnOrCreateOne {

    private readonly logger = new Logger(ProcessorGetCurrentTurnOrCreateOne.name)
    test: Test;
    executionNode: TestExecutionNode;

    constructor(
        test: Test,
        executionNode: TestExecutionNode
    ){
        this.test = test,
        this.executionNode = executionNode
    }

    execute(): TestExecutionTurn {
        let turns : TestExecutionTurn[] = this.test.testExecution.turns

        const isNoOneTurn = !turns || turns.length === 0
        if (isNoOneTurn) {
            turns = [
                {   
                    number: 1,
                    startTimeStamp: this.executionNode.recordedTimeStamp
                }
            ]
        }

        const lastTurnByNumber = turns.sort((a, b) => a.number - b.number).reverse()[0]
        return lastTurnByNumber
    }

}