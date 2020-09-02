import * as request from 'supertest';
import * as fs from 'fs';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { TestState } from 'src/models/execution/test';

describe('execute-stopwatch-test', () => {
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

  test('time-out', async () => {
    jest.setTimeout(50000000);

    const TIME_TO_WAIT_OF_PROCESS_DETECTION = 1000;
    const CONTENT_TYPE = 'application/json; charset=utf-8';

    const testJson = JSON.parse(
      fs.readFileSync('./test/e2e/stopwatch-test.json', 'utf8'),
    );

    const test = testJson.test;
    const testCode = test.code;
    const firstStopwatcher = test.template.graph.stopwatchers[0];
    const timeOfFirstStopwatcher = firstStopwatcher.time;

    // sum 10% above the original stopwatch time
    const TIME_OUT_STOPWATCH = timeOfFirstStopwatcher * 1.1;

    let lastSentTimeStamp;

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

    const checkIfTestStateEqualsTo = async (state: TestState) => {
      // get test-view with state equal READY
      await getTestView(testCode).then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.state).toEqual(state);
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
      .then(async () => await checkIfTestStateEqualsTo(TestState.READY))
      .then(async () => {
        lastSentTimeStamp = Date.now();
        await putOneDetection({
          sensorCode: '001',
          timeStamp: lastSentTimeStamp,
        });
      })
      .then(async () => {
        // Wait until timeout
        await new Promise(r => setTimeout(r, TIME_OUT_STOPWATCH));
        // Test should be DONE after timeout
        await checkIfTestStateEqualsTo(TestState.DONE);
      });
  });
});
