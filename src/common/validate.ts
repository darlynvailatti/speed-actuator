export class EnsureThat {

    static isNotNull(data: any, objectName: string){
        if(!data)
            throw new Error(`${objectName} can't be undefined`)
    }

    static isTrue(sentence: boolean, message?: string){
        if(sentence === false){
            if(!message) throw new Error(`True was expected`)
            throw new Error(message)
        }
    }

}