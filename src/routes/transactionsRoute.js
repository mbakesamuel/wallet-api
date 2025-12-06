import express from "express";
import {
  getTransactionsByUserId,
  createTransaction,
  deleteTransaction,
  getTransactionSummaryByUserId,
} from "../controllers/transactionControllers.js";

const router = express.Router();

//let write a get request that will fetch all transactions by user_id
router.get("/:userId", getTransactionsByUserId);

router.post("/", createTransaction);

//delete transaction by id
router.delete("/:id", deleteTransaction);

//let have another endpoint for the summary of transactions for a user
router.get("/summary/:userId", getTransactionSummaryByUserId);

export default router;
