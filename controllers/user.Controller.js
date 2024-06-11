import { userModel } from "../models/user.Model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import validator from "validator"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// creaet token
const createToken = (id) => {
    try {
        const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    } catch (error) {
        console.error("Error creating token:", error);
        throw new Error("Token creation failed");
    }
}

// register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res
                .status(400)
                .json(new ApiError(400, "", "User already exists"))
        }

        if (!validator.isEmail(email)) {
            return res
                .status(400)
                .json(new ApiError(400, "", "Please enter a valid Email"))
        }

        if (password.length < 8) {
            return res
                .status(400)
                .json(new ApiError(400, "", "Please enter a strong Password"))
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id);
        return res
            .status(201)
            .json(new ApiResponse(201, token, "User register successfully"))


    } catch (error) {
        return res
            .status(404)
            .json(new ApiError(404, "", "Failed to create user!"))

    }
}

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json(new ApiError(401, "", "User doesn't exists!"))
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json(new ApiError(401, "", "Password is Incorrect"))
        }

        const token = createToken(user._id);
        return res
            .status(200)
            .json(new ApiResponse(200, token, "User LoggedIn Successfully"))

    } catch (error) {
        return res
            .status(401)
            .json(new ApiError(401, "", "Failed to loggedIn!"))
    }
}

export { loginUser, registerUser }