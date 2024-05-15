import { userModel } from "../models/user.Model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// add item to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        let cartData = await userData.cartData;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1
        } else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        return res
            .status(200)
            .json(new ApiResponse(200, "", "Added to Cart Successfully"))

    } catch (error) {
        console.log("addToCart: ", error.message);
        return res
            .status(401)
            .json(new ApiError(401, "Internal Server Error", "Failed to add item to cart. Please try again later"))
    }
}

// remove item from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        if (!userData) {
            return res
                .status(401)
                .json(new ApiError(401, "", "User not found"))
        }
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        return res
            .status(200)
            .json(new ApiResponse(200, "", "Removed from Cart Successfully"))
        next();

    } catch (error) {
        console.log("removeFromCart: ", error.message);
        return res
            .status(401)
            .json(new ApiError(401, "Internal Server Error", "Failed to remove item from cart. Please try again later"))
    }
}

// fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        if (!userData) {
            return res
                .status(401)
                .json(new ApiError(401, "", "User not found"))
        }
        let cartData = await userData.cartData;
        return res
            .status(200)
            .json(new ApiResponse(200, cartData, "Cart Data Fetched Successfully"));
    } catch (error) {
        console.log("getCart: ", error.message);
        return res
            .status(401)
            .json(new ApiError(401, "Internal Server Error", "Failed to fetch cart data. Please try again later"))
    }
}

export { addToCart, removeFromCart, getCart }