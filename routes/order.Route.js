import { placeOrder, userOrders, verifyOrder } from "../controllers/order.Controller.js"
import express from 'express'
import { authMiddleware } from '../middleware/auth.Middleware.js'

const orderRouter = express.Router();

orderRouter.post("/placeOrder", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);

export default orderRouter;