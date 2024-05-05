import express from 'express'
import { addFood } from '../controllers/food.Controller.js'
import multer from 'multer'

const foodRouter = express.Router();

foodRouter.post('/add', addFood)

export default foodRouter;
