import * as mongoose from 'mongoose';


export const sequenceGeneratorSchema = new mongoose.Schema({
    collectionName: String,
    counting: Number
})

module.exports = mongoose.model('sequence-generator', sequenceGeneratorSchema);


export interface SequenceGenerator {
    readonly collectionName: string
    readonly counting: number
}

export interface SequenceGeneratorDocument extends mongoose.Document, SequenceGenerator {
    
}
