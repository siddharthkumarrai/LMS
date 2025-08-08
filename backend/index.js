import app from "./app.js";
import cloudinaryConfig from "./config/cloudinary.config.js";
import connectDB from "./config/dbConnection.js";


const port = process.env.PORT || 8081

app.listen(port,async function(){
    console.log('====================================');
    await connectDB()
    cloudinaryConfig()
    console.log(process.env.SECRET);
    
    console.log(`app is listining on port http://localhost:${port}`);
    console.log('====================================');
})