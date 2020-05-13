import { Injectable, OnApplicationBootstrap, Logger, InternalServerErrorException } from "@nestjs/common";
import { Model } from "mongoose";
import { SequenceGeneratorDocument } from "./common/mongo-sequence-generator.schema";
import { InjectModel } from "@nestjs/mongoose";
import mongoConfig from "./common/mongo.config";

@Injectable()
export class SequenceGeneratorService implements OnApplicationBootstrap {

    private readonly logger = new Logger(SequenceGeneratorService.name)

    constructor(@InjectModel('sequence-generator') private sequenceGenerator: Model<SequenceGeneratorDocument>) { }


    onApplicationBootstrap() {
        this.createDefaultSequences()
    }

    createDefaultSequences() {
        this.logger.log('Creating sequences...')

        mongoConfig.sequences.forEach(async (s) => {

            const filter = { collectionName: s }
            const foundSequence = await this.sequenceGenerator.find(filter).exec()
            if (foundSequence.length === 0)
                this.sequenceGenerator.create(
                    {
                        collectionName: s,
                        counting: 0,
                    }
                )
        })

    }


    async getNextAndSave(collectionName: string) {
        try {
            const filter = { collectionName: collectionName }
            const update = { $inc: { counting: 1 } }
            const found = await this.sequenceGenerator.findOneAndUpdate(filter, update, { new: true, }).exec()
            return found.counting
        } catch (error) {
            throw new InternalServerErrorException(`Error on get next sequence for ${collectionName}: ${error}`)
        }
    }

}