import express from "express";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import { initDB } from "./config/db.js";

//load environment variables from .env file
dotenv.config();

//creat an express app
const app = express();

//middleware to parse JSON bodies
app.use(rateLimiter);
app.use(express.json());

//we use the transactionsRoute for all routes starting with /api/transactions
app.use("/api/transactions", transactionsRoute);


//so when database is initialized then only start the server
initDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
