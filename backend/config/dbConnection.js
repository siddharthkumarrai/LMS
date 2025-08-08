import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectDB = async function(){
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`)
        console.log(`MongoDB successfully connected :: DB-HOST at: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("error to connect DB",error);
        process.exit(1)
    }
}

export default connectDB;