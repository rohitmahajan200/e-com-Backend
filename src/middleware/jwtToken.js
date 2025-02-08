import jwt from 'jsonwebtoken';

export const jwtAuth=(req,res,cb)=>{
    const token=req.headers['authorization'];    
    if(!token){
        return res.status(401).send("You are not authorise!!!")
    }
    try {
        const payload=jwt.verify(   
            token,
            'bgtwbcs7773efldcsdsDF[QY89'
        );
        console.log("payload ",payload);
        
        req.userId=payload.userID;
    } catch (error) {
        console.log(error);
        return res.status(401).send("You are not authorise!!!")
    }
    cb(); 
}