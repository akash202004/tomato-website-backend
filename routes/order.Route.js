import { placeOrder } from "../controllers/order.Controller.js"
import express from 'express'
import { authMiddleware } from '../middleware/auth.Middleware.js'

const orderRouter = express.Router();

orderRouter.post('/place', authMiddleware, placeOrder)

export default orderRouter;