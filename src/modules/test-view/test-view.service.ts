import { Injectable } from '@nestjs/common';
import { TestRepositoryService } from '../database/test-repository.service';
import { Test } from 'src/models/execution/test';
import { Edge } from 'src/models/template/edge';
import { Turn } from 'src/models/template/turn';
import { TestView } from 'src/models/view/test-view';

@Injectable()
export class TestViewService {
  constructor(readonly testRepositoryService: TestRepositoryService) {}

  async getTestView(testCode: string): Promise<TestView> {
    const test = await this.testRepositoryService.findOne(testCode);

    if (!test) throw new Error(`Can't find Test with code ${testCode}`);

    return this.convertTestToView(test);
  }

  async convertTestToView(test: Test): Promise<TestView> {
    const testExecution = test.testExecution;
    const testTemplate = test.template;
    if (!testTemplate)
      throw new Error(`Test code ${test.code} don't have Template`);

    let turns: Array<Turn> = [];
    if (testExecution) {
      turns = testExecution.turns.map(turn => {
        let edges: Edge[] = [];
        turn.executionEdges.map(executionEdge => {
          const edgeFromTemplate = testTemplate.graph.edges.find(
            e => e.sequence === executionEdge.edge.sequence,
          );

          let velocity = 0;
          let totalTime = 0;
          let startTimeStamp = '';
          let endTimeStamp = '';
          let startNode = null;
          let endNode = null;

          if (executionEdge) {
            velocity = executionEdge.velocity;
            totalTime = executionEdge.totalTime;

            if (executionEdge.startNode) {
              startTimeStamp = executionEdge.startNode.recordedTimeStamp;
              startNode = {
                code: edgeFromTemplate.startNode.code,
                recordedTime: executionEdge.startNode.time,
              };
            }

            if (executionEdge.endNode) {
              endTimeStamp = executionEdge.endNode.recordedTimeStamp;
              endNode = {
                code: edgeFromTemplate.endNode.code,
                recordedTime: executionEdge.endNode.time,
              };
            }
          }

          const edge: Edge = {
            sequence: edgeFromTemplate.sequence,
            description: edgeFromTemplate.description,
            velocity: velocity,
            totalTime: totalTime,
            startTimeStamp: startTimeStamp,
            endTimeStamp: endTimeStamp,
            distance: edgeFromTemplate.distance,
            startNode: startNode,
            endNode: endNode,
          };
          edges.push(edge);
        });

        edges = edges.sort((x, y) => x.sequence - y.sequence);

        return {
          number: turn.number,
          startTimeStamp: turn.startTimeStamp,
          endTimeStamp: turn.endTimeStamp,
          recordedStartTime: '',
          recordedEndTime: '',
          totalTime: turn.totalTime,
          averageTime: turn.averageTime,
          edges: edges,
        };
      });
    }

    const testView: TestView = {
      code: test.code,
      description: test.description,
      state: test.state,
      template: testTemplate,
      turns: turns,
    };
    return testView;
  }

  async getAllInExecution(): Promise<Array<Test>> {
    const tests = await this.testRepositoryService.findReadyOrStarted();
    if (!tests) {
      return [];
    }
    return tests;
  }
}
