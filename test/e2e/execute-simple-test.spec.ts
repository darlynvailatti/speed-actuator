import * as request from 'supertest';
import * as fs from 'fs';
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing";
import { AppModule } from "src/app.module";


describe('execute-simple-test', () => {

    let app: INestApplication;


    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                AppModule
            ]
        }).compile();

        app = moduleRef.createNestApplication()
        await app.init()
    })

    afterAll(async(done) => {
        app.close()
        done()
    })

    test('execute', async (done) => {
        
        jest.setTimeout(50000);

        const TIME_TO_WAIT_OF_PROCESS_DETECTION = 1000

        const newTemplate = {
            description: '_automated-simple-test-execution-e2e',
            numberOfTurns: 1
        }

        const test = {
            description: '_automated-simple-test-execution-e2e',
            testTemplate: {
                code: ''
            }
        }

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
                time: 12000
            },
            {
                time: 5000
            }
        ]

        let simpleTestTemplate = JSON.parse(fs.readFileSync('./test/e2e/simple-test-template.json', 'utf8')); 
        let templateCode;
        let testCode;
        let lastSentTimeStamp;
        let error;

        const httpServer = app.getHttpServer()

        await request(httpServer)
            // Create new template
            .post('/test-template')
            .set('Content-type','application/json; charset=utf-8')
            .send(newTemplate)
            .expect(201)
            .then(async (res) => {

                //Update new template with graph
                templateCode = res.body.code;
                simpleTestTemplate = Object.assign(simpleTestTemplate, { code: templateCode})
                await request(httpServer)
                    .patch('/test-template')
                    .set('Content-type','application/json; charset=utf-8')
                    .send(simpleTestTemplate)
                    .expect(200);
            })
            .then(async () => {
                //Create new Test
                test.testTemplate.code = templateCode
                await request(httpServer)
                    .post('/test')
                    .set('Content-type','application/json; charset=utf-8')
                    .send(test)
                    .then((res) => {
                        expect(res.status).toEqual(201)
                        testCode = res.body.code;
                    })
            })
            .then(async () => {
                // Update test to Ready state
                await request(httpServer)
                    .post(`/test/${testCode}/execution/ready`)
                    .set('Content-type','application/json; charset=utf-8')
                    .then((res) => {
                        expect(res.status).toEqual(201)
                    })
            })
            .then(async () => {
                // get test-view with state equal READY
                await request(httpServer)
                    .get(`/test-view/${testCode}`)
                    .then((res) => {
                        expect(res.status).toEqual(200)
                        expect(res.body.state).toEqual('READY')
                    })
            })
            .then(async () => {
                // first detection
                lastSentTimeStamp = new Date().getTime().toString()
                const detection = {
                    createdTimeStamp: lastSentTimeStamp,
                    sensorCode: '0001',
                    timeStamp: lastSentTimeStamp
                }

                await request(httpServer)
                    .post(`/detection`)
                    .send(detection)
                    .then((res) => {
                        expect(res.status).toEqual(201)
                    })
                await new Promise(r => setTimeout(r, TIME_TO_WAIT_OF_PROCESS_DETECTION));
            })
            .then(async () => {
                // check if test are STARTED and have first Edge
                await request(httpServer)
                    .get(`/test-view/${testCode}`)
                    .then((res) => {
                        expect(res.status).toEqual(200)
                        expect(res.body.state).toEqual('STARTED')
                        expect(res.body.turns).toHaveLength(1)

                        const turns = res.body.turns
                        const firstTurn = turns[0]

                        expect(firstTurn).toHaveProperty('edges')
                        expect(firstTurn.edges).toHaveLength(1)

                        const edges = firstTurn.edges
                        const firstEdge = edges[0]
                        
                        expect(firstEdge.sequence).toEqual(1)
                        expect(firstEdge.description).toEqual('sprint')
                        expect(firstEdge.distance).toEqual(15)
                        expect(firstEdge.startTimeStamp).toEqual(lastSentTimeStamp)
                        expect(firstEdge.startNode.code).toEqual('A1')
                    })
            })
            .then(async () => {
                // second detection
                const timeToAdd = times[0].time;
                const secondTimeStampPlusTime = (Number(lastSentTimeStamp) + timeToAdd).toString()
                lastSentTimeStamp = secondTimeStampPlusTime
                const detection = {
                    createdTimeStamp:  secondTimeStampPlusTime,
                    sensorCode: '0002',
                    timeStamp: secondTimeStampPlusTime
                }

                await request(httpServer)
                    .post(`/detection`)
                    .send(detection)
                    .then((res) => {
                        expect(res.status).toEqual(201)
                    })
                await new Promise(r => setTimeout(r, TIME_TO_WAIT_OF_PROCESS_DETECTION));

            })
            .then(async () => {
                // check if test have two edges
                await request(httpServer)
                    .get(`/test-view/${testCode}`)
                    .then((res) => {
                        expect(res.status).toEqual(200)
                        expect(res.body.state).toEqual('STARTED')
                        expect(res.body.turns).toHaveLength(1)

                        const turns = res.body.turns
                        const firstTurn = turns[0]

                        expect(firstTurn).toHaveProperty('edges')
                        expect(firstTurn.edges).toHaveLength(2)

                        const edges = firstTurn.edges
                        const firstEdge = edges[0]
                        
                        expect(firstEdge.sequence).toEqual(1)
                        expect(firstEdge.description).toEqual('sprint')
                        expect(firstEdge.distance).toEqual(15)
                        expect(firstEdge.endTimeStamp).toEqual(lastSentTimeStamp)
                        expect(firstEdge.startNode.code).toEqual('A1')
                        expect(firstEdge.endNode.code).toEqual('A2')
                        
                        const secondEdge = edges[1]
                        expect(secondEdge.sequence).toEqual(2)
                        expect(secondEdge.description).toEqual('first - refletion')
                        expect(secondEdge.distance).toEqual(5)
                        expect(secondEdge.startTimeStamp).toEqual(lastSentTimeStamp)
                        expect(secondEdge.startNode.code).toEqual('A2')

                    })
            })
            .then(async () => {
                 // third detection
                 const timeToAdd = times[1].time;
                 const thirdTimeStampWithAddedTime = (Number(lastSentTimeStamp) + timeToAdd).toString()
                 lastSentTimeStamp = thirdTimeStampWithAddedTime
                 const detection = {
                     createdTimeStamp:  thirdTimeStampWithAddedTime,
                     sensorCode: '0002',
                     timeStamp: thirdTimeStampWithAddedTime
                 }
 
                 await request(httpServer)
                     .post(`/detection`)
                     .send(detection)
                     .then((res) => {
                         expect(res.status).toEqual(201)
                     })
                 await new Promise(r => setTimeout(r, TIME_TO_WAIT_OF_PROCESS_DETECTION));
            })
            .then(async () => {
                // check if test have three edges
                await request(httpServer)
                    .get(`/test-view/${testCode}`)
                    .then((res) => {
                        expect(res.status).toEqual(200)
                        expect(res.body.state).toEqual('STARTED')
                        expect(res.body.turns).toHaveLength(1)

                        const turns = res.body.turns
                        const firstTurn = turns[0]

                        expect(firstTurn).toHaveProperty('edges')
                        expect(firstTurn.edges).toHaveLength(3)

                        const edges = firstTurn.edges
                        const secondEdge = edges[1]
                        
                        expect(secondEdge.sequence).toEqual(2)
                        expect(secondEdge.description).toEqual('first - refletion')
                        expect(secondEdge.distance).toEqual(5)
                        expect(secondEdge.endTimeStamp).toEqual(lastSentTimeStamp)
                        expect(secondEdge.startNode.code).toEqual('A2')
                        expect(secondEdge.endNode.code).toEqual('A2')
                        
                        const thirdEdge = edges[2]
                        expect(thirdEdge.sequence).toEqual(3)
                        expect(thirdEdge.description).toEqual('sprint - back')
                        expect(thirdEdge.distance).toEqual(15)
                        expect(thirdEdge.startTimeStamp).toEqual(lastSentTimeStamp)
                        expect(thirdEdge.startNode.code).toEqual('A2')

                    })
            })
            .then(async () => {
                 // forth detection
                 const timeToAdd = times[2].time;
                 const forthTimeStampWithAddedTime = (Number(lastSentTimeStamp) + timeToAdd).toString()
                 lastSentTimeStamp = forthTimeStampWithAddedTime
                 const detection = {
                     createdTimeStamp:  forthTimeStampWithAddedTime,
                     sensorCode: '0001',
                     timeStamp: forthTimeStampWithAddedTime
                 }
 
                 await request(httpServer)
                     .post(`/detection`)
                     .send(detection)
                     .then((res) => {
                         expect(res.status).toEqual(201)
                     })
                 await new Promise(r => setTimeout(r, TIME_TO_WAIT_OF_PROCESS_DETECTION));
            })
            .then(async () => {
                // check if test have three edges
                await request(httpServer)
                    .get(`/test-view/${testCode}`)
                    .then((res) => {
                        expect(res.status).toEqual(200)
                        expect(res.body.state).toEqual('STARTED')
                        expect(res.body.turns).toHaveLength(1)

                        const turns = res.body.turns
                        const firstTurn = turns[0]

                        expect(firstTurn).toHaveProperty('edges')
                        expect(firstTurn.edges).toHaveLength(4)

                        const edges = firstTurn.edges
                        const thridEdge = edges[2]
                        
                        expect(thridEdge.sequence).toEqual(3)
                        expect(thridEdge.description).toEqual('sprint - back')
                        expect(thridEdge.distance).toEqual(15)
                        expect(thridEdge.endTimeStamp).toEqual(lastSentTimeStamp)
                        expect(thridEdge.startNode.code).toEqual('A2')
                        expect(thridEdge.endNode.code).toEqual('A1')
                        
                        const forthEdge = edges[3]
                        expect(forthEdge.sequence).toEqual(4)
                        expect(forthEdge.description).toEqual('second reflextion')
                        expect(forthEdge.distance).toEqual(10)
                        expect(forthEdge.startTimeStamp).toEqual(lastSentTimeStamp)
                        expect(forthEdge.startNode.code).toEqual('A1')

                    })
            })
            .then(async () => {
                // fifth detection
                const timeToAdd = times[3].time;
                const fifthTimeStampWithAddedTime = (Number(lastSentTimeStamp) + timeToAdd).toString()
                lastSentTimeStamp = fifthTimeStampWithAddedTime
                const detection = {
                    createdTimeStamp:  fifthTimeStampWithAddedTime,
                    sensorCode: '0001',
                    timeStamp: fifthTimeStampWithAddedTime
                }

                await request(httpServer)
                    .post(`/detection`)
                    .send(detection)
                    .then((res) => {
                        expect(res.status).toEqual(201)
                    })
                await new Promise(r => setTimeout(r, TIME_TO_WAIT_OF_PROCESS_DETECTION));
           })
           .then(async () => {
            // check if test have four edges
            await request(httpServer)
                .get(`/test-view/${testCode}`)
                .then((res) => {
                    expect(res.status).toEqual(200)
                    expect(res.body.state).toEqual('DONE')
                    expect(res.body.turns).toHaveLength(1)

                    const turns = res.body.turns
                    const firstTurn = turns[0]

                    expect(firstTurn).toHaveProperty('edges')
                    expect(firstTurn.edges).toHaveLength(4)

                    const edges = firstTurn.edges
                    const forthEdge = edges[3]
                    
                    expect(forthEdge.sequence).toEqual(4)
                    expect(forthEdge.description).toEqual('second reflextion')
                    expect(forthEdge.distance).toEqual(10)
                    expect(forthEdge.endTimeStamp).toEqual(lastSentTimeStamp)
                    expect(forthEdge.startNode.code).toEqual('A1')
                    expect(forthEdge.endNode.code).toEqual('A1')
                    
                })
            })
            .catch((err) => {
                error = err
            });
        
        expect(error).toBeUndefined()
        done()
    })

})