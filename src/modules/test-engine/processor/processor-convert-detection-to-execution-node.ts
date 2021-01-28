import { Logger } from '@nestjs/common';
import { TestTemplate } from 'src/models/template/test-template';
import { SensorDetectionMessage } from 'src/models/sensor/sensor-message';
import { TestExecutionNode } from 'src/models/execution/test.execution';

export default class ProcessorConvertDetectionToExecutionNode {
  private readonly logger = new Logger(
    ProcessorConvertDetectionToExecutionNode.name,
  );

  testTemplate: TestTemplate;
  sensorDetectionMessage: SensorDetectionMessage;

  constructor(
    sensorDetectionMessage: SensorDetectionMessage,
    testTemplate: TestTemplate,
  ) {
    this.sensorDetectionMessage = sensorDetectionMessage;
    this.testTemplate = testTemplate;
  }

  execute(): TestExecutionNode {
    this.validateMandatoryFields();

    const sensorCode = this.sensorDetectionMessage.sensor.code;

    this.logger.log(`Finding Node with sensor code ${sensorCode}`);
    const graph = this.testTemplate.graph;
    const node = graph.nodes.find(n => n.sensor.code === sensorCode);

    if (!node) {
      this.logger.log(
        `The graph don't have Node with sensor code ${sensorCode}`,
      );
      return;
    }

    this.logger.log(`Node: ${node.code}`);

    return {
      node: {
        code: node.code,
      },
      recordedTimeStamp: this.sensorDetectionMessage.timeStamp,
    };
  }

  private validateMandatoryFields() {
    if (!this.sensorDetectionMessage)
      throw new Error(`Can't convert an empty SensorDetectionMessage`);

    if (!this.sensorDetectionMessage.sensor)
      throw new Error(
        `Can't convert an empty Sensor of SensorDetectionMessage`,
      );

    if (!this.sensorDetectionMessage.sensor.code)
      throw new Error(
        `Can't convert an empty Code Sensor of SensorDetectionMessage`,
      );

    if (!this.sensorDetectionMessage.timeStamp)
      throw new Error(
        `Can't convert an SensorDetectionMessage with empty TimeStamp`,
      );

    if (!this.testTemplate)
      throw new Error(
        `Can't convert an SensorDetectionMessage without TestTemplate`,
      );

    if (!this.testTemplate.graph || !this.testTemplate.graph.nodes)
      throw new Error(
        `Can't convert an SensorDetectionMessage with TestTemplate without or empty Graph`,
      );
  }
}
