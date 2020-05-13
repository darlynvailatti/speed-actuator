export interface Edge {
    code?: string,
    sequence?: number,
    description: string,
    distance: number,
    startNode: {
        code: string
    },
    endNode: {
        code: string
    }
}

