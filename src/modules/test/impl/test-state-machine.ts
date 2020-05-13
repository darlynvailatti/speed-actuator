
import { TestState, Test } from "src/models/execution/test";



class TestStateMachineImpl {

    private readonly test: Test

    constructor(test: Test){
        this.test = test
    }

    changeToNewState(newState: TestState){

        if(!newState)
            throw new Error(`New state is mandatory`)

        switch (newState) {
            case TestState.IDLE:
                this.changeToIdle()
                break;
            case TestState.READY:
                this.changeToReady()
                break;
            case TestState.STARTED:
                this.changeToStarted()
                break;
            case TestState.DONE:
                this.changeToDone()
                break;
            case TestState.CANCELLED:
                this.changeToCancelled()
                break;
        
            default:
                throw new Error(`State ${newState} don't have implementation yet`);

        }

        this.test.state = newState

    }
    
    private changeToIdle() {
        const state = this.test.state
        const validStates = [TestState.CANCELLED, TestState.DONE]

        const isAnValidState = validStates.filter(s => s === state).length > 0

        if(!isAnValidState)
            throw new Error(`Can't change state from ${state} to ${TestState.IDLE}`)
    }
    
    private changeToReady() {
        const state = this.test.state
        const validStates = [TestState.CANCELLED, TestState.DONE, TestState.IDLE]

        const isAnValidState = validStates.filter(s => s === state).length > 0

        if(!isAnValidState)
            throw new Error(`Can't change state from ${state} to ${TestState.READY}`)

    }

    private changeToStarted() {
        const state = this.test.state

        const isReady = TestState.READY === state
        if(!isReady)
            throw new Error(`Test is not ready to start`)
    }

    private changeToDone() {
        const state = this.test.state

        const isStarted = TestState.STARTED === state
        if(!isStarted)
            throw new Error(`Only started Test can be ${TestState.DONE}`)
    }

    private changeToCancelled() {
        const state = this.test.state

        const validStates = [TestState.READY, TestState.STARTED]

        const isAnValidState = validStates.filter(s => s === state).length > 0
        if(!isAnValidState)
            throw new Error(`Only ${validStates} Test can be ${TestState.CANCELLED}`)

    }


}

export class TestStateMachine {

    static change(test: Test, newState: TestState){
        new TestStateMachineImpl(test).changeToNewState(newState)
    }

}