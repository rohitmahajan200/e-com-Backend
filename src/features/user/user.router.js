import expres from 'express'
import UserController from './user.controller.js';
const controller=new UserController()
const router =expres.Router();

router.post('/login',controller.postLogin);
router.post('/signUp',controller.postSignUp);

export default router;
