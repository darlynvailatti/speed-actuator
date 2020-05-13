import { SensorSchema as sensorSchema } from "src/models/sensor/schema/sensor.schema";
import { Constants } from "src/constants/constants";
import { testTemplateSchema} from "src/models/template/schema/test.template.schema";
import { sequenceGeneratorSchema } from "./mongo-sequence-generator.schema";
import { testSchema } from "src/models/execution/schema/test.schema";

export default {
    url: `${Constants.MONGO_URL}${Constants.MONGO_DB}`,
    schemas: [
        {
            name: 'sensor', schema: sensorSchema
        },
        {
            name: 'test-template', schema: testTemplateSchema
        },
        {
            name: 'sequence-generator', schema: sequenceGeneratorSchema
        },
        {
            name: 'test', schema: testSchema
        }
    ],
    sequences: ['test','test-template','sensor']

}