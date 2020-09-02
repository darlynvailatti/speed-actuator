import * as request from 'supertest';
import * as fs from 'fs';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { TestState } from 'src/models/execution/test';

describe('execute-simple-test', () => {
  let app: INestApplication;
  let httpServer;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    httpServer = app.getHttpServer();
    await app.init();
  });

  afterAll(async done => {
    app.close();
    done();
  });

  test('execute', async done => {
    jest.setTimeout(50000);

    const TIME_TO_WAIT_OF_PROCESS_DETECTION = 1000;
    const CONTENT_TYPE = 'application/json; charset=utf-8';

    const times = [
      {
        // first time
        time: 10000,
      },
      {
        // second time
        time: 3000,
      },
      {
        // third time
        time: 12000,
      },
    ];

    const testJson = JSON.parse(
      fs.readFileSync('./test/e2e/simple-test.json', 'utf8'),
    );
    const testCode = testJson.test.code;

    let lastSentTimeStamp;
    let error;

    const postTest = async () => {
      await request(httpServer)
        // Post new test
        .post('/test')
        .set('Content-type', CONTENT_TYPE)
        .send(JSON.stringify(testJson))
        .then(res => {
          expect(res.status).toEqual(201);
        });
    };

    const updateToReady = async () => {
      await request(httpServer)
        .put(`/test/${testCode}/execution/ready`)
        .set('Content-type', CONTENT_TYPE)
        .then(res => {
          expect(res.status).toEqual(200);
        });
    };

    const getTestView = async testCode => {
      return await request(httpServer).get(`/test-view/${testCode}`);
    };

    const checkIfTestStateEqualsToReady = async () => {
      // get test-view with state equal READY
      await request(httpServer)
        .get(`/test-view/${testCode}`)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.state).toEqual('READY');
        });
    };

    const putOneDetection = async ({ sensorCode, timeStamp }) => {
      const detection = {
        createdTimeStamp: timeStamp,
        sensor: {
          code: sensorCode,
        },
        timeStamp: timeStamp,
      };

      await request(httpServer)
        .put(`/detection`)
        .send(detection)
        .then(res => {
          expect(res.status).toEqual(200);
        });
      await new Promise(r => setTimeout(r, TIME_TO_WAIT_OF_PROCESS_DETECTION));
    };

    await postTest()
      .then(async () => await updateToReady())
      .then(async () => await checkIfTestStateEqualsToReady())
      .then(async () => {
        lastSentTimeStamp = Date.now();
        await putOneDetection({
          sensorCode: '001',
          timeStamp: lastSentTimeStamp,
        });
      })
      .then(async () => {
        // check if test are STARTED and have first Edge
        getTestView(testCode).then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.state).toEqual(TestState.STARTED);
          expect(res.body.turns).toHaveLength(1);

          const turns = res.body.turns;
          const firstTurn = turns[0];

          expect(firstTurn).toHaveProperty('edges');
          expect(firstTurn.edges).toHaveLength(1);

          const edges = firstTurn.edges;
          const firstEdge = edges[0];

          expect(firstEdge.sequence).toEqual(1);
          expect(firstEdge.startTimeStamp).toEqual(lastSentTimeStamp);
          expect(firstEdge.startNode.code).toEqual('A1');
        });
      })
      .then(async () => {
        // second detection
        const timeToAdd = times[0].time;
        lastSentTimeStamp = Number(lastSentTimeStamp) + timeToAdd;
        await putOneDetection({
          sensorCode: '002',
          timeStamp: lastSentTimeStamp,
        });
      })
      .then(async () => {
        // check if test have two edges
        await getTestView(testCode).then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.state).toEqual(TestState.STARTED);
          expect(res.body.turns).toHaveLength(1);

          const turns = res.body.turns;
          const firstTurn = turns[0];

          expect(firstTurn).toHaveProperty('edges');
          expect(firstTurn.edges).toHaveLength(2);

          const edges = firstTurn.edges;
          const firstEdge = edges[0];

          expect(firstEdge.sequence).toEqual(1);
          expect(firstEdge.endTimeStamp).toEqual(lastSentTimeStamp);
          expect(firstEdge.startNode.code).toEqual('A1');
          expect(firstEdge.endNode.code).toEqual('A2');

          const secondEdge = edges[1];
          expect(secondEdge.sequence).toEqual(2);
          expect(secondEdge.startTimeStamp).toEqual(lastSentTimeStamp);
          expect(secondEdge.startNode.code).toEqual('A2');
        });
      })
      .then(async () => {
        // third detection
        const timeToAdd = times[1].time;
        lastSentTimeStamp = Number(lastSentTimeStamp) + timeToAdd;
        await putOneDetection({
          sensorCode: '001',
          timeStamp: lastSentTimeStamp,
        });
      })
      .then(async () => {
        // check if test is DONE
        await request(httpServer)
          .get(`/test-view/${testCode}`)
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.body.state).toEqual('DONE');
            expect(res.body.turns).toHaveLength(1);

            const turns = res.body.turns;
            const firstTurn = turns[0];

            expect(firstTurn).toHaveProperty('edges');
            expect(firstTurn.edges).toHaveLength(2);

            const edges = firstTurn.edges;
            const secondEdge = edges[1];

            expect(secondEdge.sequence).toEqual(2);
            expect(secondEdge.endTimeStamp).toEqual(lastSentTimeStamp);
            expect(secondEdge.startNode.code).toEqual('A2');
            expect(secondEdge.endNode.code).toEqual('A1');
          });
      })
      .catch(err => {
        error = err;
      });

    expect(error).toBeUndefined();
    done();
  });
});
