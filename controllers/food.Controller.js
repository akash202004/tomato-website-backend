import { foodModel } from "../models/food.Model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import fs from 'fs';

// add food items
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try {
        await food.save();
        return res
            .status(200)
            .json(new ApiResponse(200, food, "Food added successfully"))
    } catch (error) {
        return res
            .json(new ApiError(401, "", "Failed to add food"));
    }
}

// list all food
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({})
        return res
            .status(200)
            .json(new ApiResponse(201, foods, "All the foods listed in DB"))
    } catch (error) {
        return res
            .json(new ApiError(401, "", "Error in fetching listed food data from DB"));
    }

}

// remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { })
        await foodModel.findByIdAndDelete(req.body.id);
        return res
            .status(200)
            .json(new ApiResponse(201, food.image, "Food removed successfully"))
    } catch (error) {
        return res
            .json(new ApiError(401, req.body.id, "Error in deleting listed food"));
    }
}


export { addFood, listFood, removeFood }