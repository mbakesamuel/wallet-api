import { sql } from "../config/db.js";

export const getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;

    // Sort transactions by created_at in descending order
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;
    const newTransaction =
      await sql`INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;
    res.status(201).json(newTransaction[0]);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result = await sql`DELETE FROM transactions WHERE id = ${id}`;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get transaction summary by user id
export const getTransactionSummaryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql` 
      SELECT COALESCE(SUM(amount), 0) AS balance 
      FROM transactions 
      WHERE user_id = ${userId}
    `;

    const incomeResult = await sql` 
      SELECT COALESCE(SUM(amount), 0) AS income 
      FROM transactions 
      WHERE user_id = ${userId} AND amount > 0
    `;

    const expenseResult = await sql` 
      SELECT COALESCE(SUM(amount), 0) AS expense 
      FROM transactions 
      WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    });
  } catch (error) {
    console.error("Error fetching transactions summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
