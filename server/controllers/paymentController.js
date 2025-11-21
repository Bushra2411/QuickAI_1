// server/controllers/paymentController.js
import sql from "../configs/db.js"; // ✅ Correct path

export const createPayment = async (req, res) => {
  try {
    const { method, transactionId, contact } = req.body;
    const userId = req.auth.userId; // assuming Clerk auth sets this

    if (!method || !transactionId || !contact) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Insert payment info
    const insertQuery = `
      INSERT INTO payments (user_id, method, transaction_id, contact, amount, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const paymentResult = await sql.query(insertQuery, [
      userId,
      method,
      transactionId,
      contact,
      500,       // example amount
      "success", // status
    ]);

    // 2️⃣ Update or insert user plan
    const upsertUserQuery = `
      INSERT INTO users (clerk_id, plan)
      VALUES ($1, 'premium')
      ON CONFLICT (clerk_id)
      DO UPDATE SET plan = 'premium';
    `;
    await sql.query(upsertUserQuery, [userId]);

    res.status(201).json({
      message: "Payment successful!",
      payment: paymentResult.rows[0],
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
