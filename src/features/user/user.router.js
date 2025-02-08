import expres from 'express'
import UserController from './user.controller.js';
const controller=new UserController()
const router =expres.Router();

router.post('/login',(req,res)=>{controller.postLogin(req,res)})
router.post('/signUp',(req,res)=>{controller.postSignUp(req,res)});

export default router;
