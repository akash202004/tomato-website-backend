import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res
            .status(401)
            .json(new ApiError(401, "", "Not Authorized, Login Again"))
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = tokenDecode.id;
        next()
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        return res
            .status(401)
            .json(new ApiError(401, "Unauthorized", "Invalid or expired token"))
    }
}

export { authMiddleware }