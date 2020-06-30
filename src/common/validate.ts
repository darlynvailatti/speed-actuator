export class EnsureThat {

    static isNotNull(data: any, objectName: string){
        if(!data && !objectName)
            throw new Error(`${objectName} can't be undefined`)
        if(!data && objectName)
            throw new Error(`${objectName}`)
    }

    static isTrue(sentence: boolean, message?: string){
        if(sentence === false){
            if(!message) throw new Error(`True was expected`)
            throw new Error(message)
        }
    }

    static isNotEmpty(array: Array<any>, message?: string){
        if(array != null && array.length > 0)
            return;
        throw new Error(message ? message: `Array can't be empty or null`)
    }

}