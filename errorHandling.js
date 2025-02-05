export default class ApplicationError extends Error{
    constructor(error,code){
        super(error)
        this.code=code;
    }
}