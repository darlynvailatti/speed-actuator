export interface Edge {
    code?: string,
    sequence?: number,
    description: string,
    distance: number,
    baseTime?: number, 
    stopWatch?: boolean,
    startNode: {
        code: string
    },
    endNode: {
        code: string
    }
}

