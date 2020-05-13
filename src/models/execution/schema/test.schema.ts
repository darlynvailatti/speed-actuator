import * as mongoose from 'mongoose';

export const testSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: String,
    numberOfTurns: Number,
    state: String,
    template: {
        code: String
    },
    testExecution: {
        who: String,
        when: Date,
        turns: [
            {
                number: Number,
                startTimeStamp: String,
                endTimeStamp: String,
                executionEdges: [
                    {
                        edge: {
                            sequence: Number,
                        },
                        velocity: Number,
                        totalTime: Number,
                        startNode: {
                            code: String,
                            recordedTimeStamp: String,
                            time: Number
                        },
                        endNode: {
                            code: String,
                            recordedTimeStamp: String,
                            time: Number
                        },
                    }
                ]
            }
        ]
    }
})