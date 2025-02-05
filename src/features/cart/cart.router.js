import express from 'express'
import CartController from './cart.controller.js'

export const cartRouter=express.Router()

cartRouter.get('/',CartController.getAll)
cartRouter.post('/',CartController.add);
cartRouter.delete('/:productId',CartController.delete)

