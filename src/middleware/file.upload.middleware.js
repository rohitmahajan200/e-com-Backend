import multer from 'multer';

const storageConfig=multer.diskStorage({
    destination:(req,file,next)=>{
        next(null,'./upload')
    },
    filename:(req,file,next)=>{
        next(null,Date.now()+'-'+file.originalname)
    }
})

export const upload=multer({storage:storageConfig});