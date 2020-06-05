import ProcessorConvertDetectionToExecutionNode from '../../src/modules/state-updater/processor/processor-convert-detection-to-execution-node';
import { TestTemplate } from 'src/models/template/test.template';
import { SensorDetectionMessage } from 'src/models/sensor/sensor-message';
import { TestExecutionNode } from 'src/models/execution/test.execution';

describe('Convert Message Detection to Execution Node', () => {
    

    test('Successful convert message detection', () => {

        const nodeOne = {
            code: "N1",
            sensor: {
                code: "1",
            }
        }

        const testTemplate : TestTemplate = {
            description: "",
            code: "",
            graph: {
                description: "",
                nodes: [ nodeOne ]
            }
        }

        const currentTimeStamp = new Date().getTime().toString();
        const sensorDetectionMessage: SensorDetectionMessage = {
            createdTimeStamp: currentTimeStamp,
            timeStamp: currentTimeStamp,
            sensor: {
                code: "1", 
            },
        }

        const processorConvert = new ProcessorConvertDetectionToExecutionNode(
            sensorDetectionMessage,
            testTemplate
        )
        const convertedExecutionNode : TestExecutionNode = processorConvert.execute()
        expect(convertedExecutionNode.node.code).toEqual(nodeOne.code)
        expect(convertedExecutionNode.recordedTimeStamp).not.toBeNull()

    })

    test('Fail to convert detection message without timeStamp', () => {
        const currentTimeStamp = new Date().getTime().toString();
        const sensorDetectionMessage: SensorDetectionMessage = {
            createdTimeStamp: currentTimeStamp,
            timeStamp: null,
            sensor: {
                code: "1", 
            },
        }
        const processorConvert = new ProcessorConvertDetectionToExecutionNode(
            sensorDetectionMessage,
            null
        )
        expect(() => processorConvert.execute()).toThrowError(`Can't convert an SensorDetectionMessage with empty TimeStamp`)
    })

    test('Fail to convert detection message without testTemplate', () => {
        const currentTimeStamp = new Date().getTime().toString();
        const sensorDetectionMessage: SensorDetectionMessage = {
            createdTimeStamp: currentTimeStamp,
            timeStamp: currentTimeStamp,
            sensor: {
                code: "1", 
            },
        }
        const processorConvert = new ProcessorConvertDetectionToExecutionNode(
            sensorDetectionMessage,
            null
        )
        expect(() => processorConvert.execute()).toThrowError(`Can't convert an SensorDetectionMessage without TestTemplate`)
    })

    test('Fail to convert detection message, graph don\'t have the Node', () => {
        const nodeOne = {
            code: "N1",
            sensor: {
                code: "1",
            }
        }

        const testTemplate : TestTemplate = {
            description: "",
            code: "",
            graph: {
                description: "",
                nodes: [ nodeOne ]
            }
        }

        const currentTimeStamp = new Date().getTime().toString();
        const sensorCode = "9999"
        const sensorDetectionMessage: SensorDetectionMessage = {
            createdTimeStamp: currentTimeStamp,
            timeStamp: currentTimeStamp,
            sensor: {
                code: sensorCode, 
            },
        }

        const processorConvert = new ProcessorConvertDetectionToExecutionNode(
            sensorDetectionMessage,
            testTemplate
        )
        expect(() => processorConvert.execute()).toThrowError(`The graph don\'t have Node with sensor code ${sensorCode}`)

    })


})