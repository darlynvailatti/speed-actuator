import { Injectable } from '@nestjs/common';
import { ValidationRequest, ValidationResponse } from './validation.dto';
import { EnsureThat } from 'src/common/validate';
import { TestTemplate } from 'src/models/template/test.template';

@Injectable()
export class TestTemplateValidatorService {
  private template: TestTemplate;

  public async validate(
    validationRequest: ValidationRequest,
  ): Promise<ValidationResponse> {
    try {
      EnsureThat.isNotNull(
        validationRequest.testTemplate,
        `Validation request is empty`,
      );

      this.template = validationRequest.testTemplate;
      EnsureThat.isNotNull(
        this.template.graph,
        `Template ${this.template.code} don't have Graph`,
      );

      this.graphValidation();

      return {
        isValid: true,
      };
    } catch (error) {
      const message = `Error on validate TestTemplate ${validationRequest.testTemplate.code}: ${error}`;
      return {
        isValid: false,
        causeIfIsNotValid: message,
      };
    }
  }

  private graphValidation() {
    const graph = this.template.graph;

    EnsureThat.isTrue(
      graph.edges && graph.edges.length > 0,
      `One or more edges is mandatory`,
    );
    EnsureThat.isTrue(
      graph.nodes && graph.nodes.length > 0,
      `One or more nodes is mandatory`,
    );

    this.nodesValidation();
    this.edgesValidation();
  }

  private nodesValidation() {
    const graph = this.template.graph;
    const edges = graph.edges;
    const nodes = graph.nodes;

    nodes.forEach(n => {
      EnsureThat.isNotNull(n.code, `One or more node(s) don't have code`);

      const isHaveSensorDefinition = n.sensor != null && n.sensor.code != null;
      EnsureThat.isTrue(
        isHaveSensorDefinition,
        `Node ${n.code} don't have Sensor definition`,
      );

      const edgeWithStartOrEndNode = edges.find(
        e => e.startNode.code === n.code || e.endNode.code === n.code,
      );
      EnsureThat.isNotNull(
        edgeWithStartOrEndNode,
        `Node ${n.code} is not present in any Edge`,
      );

      const nodesWithSameSensor = nodes.filter(
        node => node.sensor.code === n.sensor.code && node.code != n.code,
      );
      EnsureThat.isTrue(
        !nodesWithSameSensor || nodesWithSameSensor.length === 0,
        `Sensor '${
          n.sensor.code
        }' is already set in another nodes: ${nodesWithSameSensor
          .map(n => n.code)
          .join(', ')}`,
      );
    });
  }

  private edgesValidation() {
    const graph = this.template.graph;
    const edges = graph.edges;

    const nodesWithCommaSepareted = graph.nodes.map(n => n.code).join(',');

    edges.forEach(edge => {
      EnsureThat.isNotNull(
        edge.sequence,
        `One or more edge's don't have sequence`,
      );
      EnsureThat.isNotNull(
        edge.description,
        `One or more edge's don't have descritpion`,
      );

      const edegName = edge.sequence + ' - ' + edge.description;
      EnsureThat.isNotNull(
        edge.distance,
        `Edge '${edegName}' don't have distance`,
      );

      EnsureThat.isTrue(
        edge.startNode && edge.startNode.code != null,
        `Edge '${edegName}' don't have startNode`,
      );
      EnsureThat.isTrue(
        edge.endNode && edge.endNode.code != null,
        `Edge '${edegName}' don't have endNode`,
      );

      const startNode = graph.nodes.filter(n => n.code === edge.startNode.code);
      EnsureThat.isTrue(
        startNode.length > 0,
        `Start node ${edge.startNode.code} of edge '${edegName}' is not present in available Nodes: [${nodesWithCommaSepareted}]`,
      );

      const endNode = graph.nodes.filter(n => n.code === edge.endNode.code);
      EnsureThat.isTrue(
        endNode.length > 0,
        `End node ${edge.endNode.code} of edge '${edegName}' is not present in available Nodes: [${nodesWithCommaSepareted}]`,
      );

      // if (edge.stopWatch) {
      //   EnsureThat.isNotNull(
      //     edge.baseTime,
      //     `Edge ${edegName} is StopWatch but don't have BaseTime`,
      //   );
      // }

      const edgeWithThisSequence = edges.filter(
        e => e.sequence === edge.sequence,
      );
      EnsureThat.isTrue(
        edgeWithThisSequence.length === 1,
        `Sequence '${edge.sequence}' already set in another Edge(s)`,
      );

      EnsureThat.isTrue(
        edge.sequence >= 0,
        `Sequence '${edge.sequence}' is invalid`,
      );
    });
  }
}
