import { orderModel } from "../models/order.Model.js";
import { userModel } from "../models/user.Model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order from frontend
const placeOrder = async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL;

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 82
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: 2 * 100 * 82
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        return res
            .status(200)
            .json(new ApiResponse(200, { session_url: session.url }, "Order placed successfully"))

    } catch (error) {
        console.log("placeOrder error", error);
        return res
            .status(401)
            .json(new ApiError(401, "", "Failed to place order"));
    }
}

// Verifying user order from frontend
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: "true" });
            res
                .status(200)
                .json(new ApiResponse(200, "", "Payment successful"));
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res
                .status(401)
                .json(new ApiError(401, "", "Payment failed"));
        }
    } catch (error) {
        console.log("verifyOrder error", error);
        return res
            .status(401)
            .json(new ApiError(401, "", "Failed to verify order"));
    }
}

// users order for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        return res
            .status(200)
            .json(new ApiResponse(200, orders, "User orders fetched successfully"));
    } catch (error) {
        console.log("userOrders error", error);
        return res
            .status(401)
            .json(new ApiError(401, "", "Failed to fetch user orders"));
    }
}

// lisitng all orders for admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        return res
            .status(200)
            .json(new ApiResponse(200, orders, "Orders fetched successfully"));
    } catch (error) {
        console.log("listOrders error", error);
        return res
            .status(401)
            .json(new ApiError(401, "", "Failed to fetch orders"));
    }
}

// updating order status for admin
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        return res
            .status(200)
            .json(new ApiResponse(200, "", "Order status updated successfully"));
    } catch (error) {
        console.log("updateStatus error", error);
        return res
            .status(401)
            .json(new ApiError(401, "", "Failed to update order status"));
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus }