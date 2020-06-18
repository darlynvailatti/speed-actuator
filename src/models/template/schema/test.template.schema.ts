import * as mongoose from 'mongoose';


// TestTemplate
export const testTemplateSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: String,
    numberOfTurns: Number,
    graph: {
        code: String,
        description: String,
        edges: [{
            code: { type: String, required: true, unique: true },
            description: String,
            sequence: Number,
            distance: Number,
            baseTime: Number,
            stopWatch: Boolean,
            startNode: {
                code: String
            },
            endNode: {
                code: String
            },
            graph: {
                code: String
            }
        }],
        nodes: [{
            code: { type: String, required: true, unique: true },
            description: String,
            sensor: {
                code: String
            }
        }]
    }
})

module.exports = mongoose.model('test-template', testTemplateSchema);

