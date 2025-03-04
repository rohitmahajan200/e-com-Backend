import express from 'express';
import { LikeController } from './like.controller.js';
export const likeRouter=express.Router();
const controller=new LikeController();

likeRouter.post('/',(req,res)=>controller.likeItem(req,res));
likeRouter.get('/',(req,res)=>controller.getLikes(req,res));
likeRouter.get('/user',(req,res)=>controller.getUsersLikes(req,res));