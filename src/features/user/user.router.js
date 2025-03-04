import expres from 'express'
import UserController from './user.controller.js';
import { jwtAuth } from '../../middleware/jwtToken.js';
const controller=new UserController()
const router =expres.Router();

router.post('/login',(req,res)=>{controller.postLogin(req,res)})
router.post('/signUp',(req,res,next)=>{controller.postSignUp(req,res,next)});
router.post('/resetPassword',jwtAuth,(req,res)=>{controller.resetPassword(req,res)});

export default router;
