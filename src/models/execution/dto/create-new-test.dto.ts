
export interface CreateNewTestDTO {

    description: string,
    numberOfTurns: number,
    testTemplate: {
        code: string
    },
}