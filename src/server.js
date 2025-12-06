import express from "express";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import { initDB } from "./config/db.js";
import job from "./config/cron.js";

//load environment variables from .env file
dotenv.config();

//creat an express app
const app = express();

if(process.env.NODE_ENV === "production") {
  //start the cron job only in production environment
  job.start();
}

//middleware to parse JSON bodies
app.use(rateLimiter);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "API is healthy" });
});

//we use the transactionsRoute for all routes starting with /api/transactions
app.use("/api/transactions", transactionsRoute);


//so when database is initialized then only start the server
initDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
