import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import foodRouter from './routes/food.Route.js';
import userRouter from './routes/user.Route.js';
import cartRouter from './routes/cart.Route.js';
import orderRouter from './routes/order.Route.js';


// dotnev config
dotenv.config()

// app config
const app = express()
const port = process.env.PORT

// middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cors());

// db connection
connectDB();

// api endpoint
app.use('/api/food', foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

app.get("/", (req, res) => {
    res.send("Akash Laha");
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

