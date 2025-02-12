import express from 'express'
import CartController from './cart.controller.js'
const controller=new CartController()
export const cartRouter=express.Router()

cartRouter.get('/',(req,res)=>controller.get(req,res))
cartRouter.post('/',(req,res)=>controller.add(req,res));
cartRouter.delete('/',(req,res)=>controller.delete(req,res))

