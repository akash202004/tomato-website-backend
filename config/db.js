import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DB_NAME}`)
            .then(() => {
                console.log('Db Connected Succssfully');
            })
    } catch (error) {
        console.log(error);
    }
}