import { orderModel } from "../models/order.Model.js";
import { userModel } from "../models/user.Model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import Stripe from 'stripe';

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
        await userModel.findOneAndUpdate(req.body.userId, { cartData: {} });

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
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        return res
            .status(200)
            .json(new ApiResponse(200, session, "Order placed successfully"))
    } catch (error) {
        console.log("placeOrder error", error);
        return res
            .status(401)
            .json(new ApiError(401, "", "Failed to place order"));
    }
}

export { placeOrder }