import express from 'express'
import OrderController from './order.controller.js';
const orderRouter=express.Router();
const controller=new OrderController();

orderRouter.post('/',(req,res,next)=>controller.placeOrder(req,res,next));

export default orderRouter;