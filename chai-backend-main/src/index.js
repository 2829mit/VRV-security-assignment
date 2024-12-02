import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
});

console.log("MongoDB URI:", process.env.MONGODB_URI); // Add this line for debugging

// IIFE to handle async operations
(async () => {
    try {
        await connectDB();
        console.log("MongoDB connection successful");
        
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port: ${process.env.PORT}`);
        });

    } catch (error) {
        console.error("ERROR:", error);
        process.exit(1);
    }
})();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});
