// server/routes/paymentRoutes.js
/*import express from 'express';
import { createPayment } from '../controllers/paymentController.js';

const router = express.Router();

// POST route for creating payment
router.post('/create-payment', createPayment);

export default router; // ✅ default export
*/





/*import express from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";

const router = express.Router();

// POST /api/pay-premium
router.post("/pay-premium", async (req, res) => {
  const { userId, method, transactionId } = req.body;

  try {
    // 1️⃣ Verify payment with Bkash/Nagad/Rocket
    const paymentVerified = await verifyPayment(method, transactionId); // implement this
    if (!paymentVerified) return res.status(400).json({ error: "Payment failed" });

    // 2️⃣ Upgrade user plan in Clerk
    const subscription = await clerkClient.subscriptions.createSubscription({
      userId,
      priceId: "price_123456", // Stripe price ID for Premium
    });

    res.json({ success: true, subscription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;*/


/*import express from "express";
const router = express.Router();

router.post("/payment", (req, res) => {
  console.log("Payment request body:", req.body); // এটা দেখাবে কি data আসছে
  res.json({ success: true }); // frontend কে JSON পাঠাবে
});

export default router;*/

// paymentRoutes.js
/*import express from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";

const router = express.Router();

// Temporary mock function for payment verification
async function verifyPayment(method, transactionId) {
  // ✅ Demo purposes: সব payment pass হবে
  if (!method || !transactionId) return false;
  return true;
}

// POST /api/payment/pay-premium
router.post("/pay-premium", async (req, res) => {
  const { userId, method, transactionId } = req.body;

  try {
    // 1️⃣ Verify payment (mock)
    const paymentVerified = await verifyPayment(method, transactionId);
    if (!paymentVerified) return res.status(400).json({ error: "Payment failed" });

    // 2️⃣ Upgrade user plan in Clerk (mock for now)
    // Real code: use clerkClient.subscriptions.createSubscription()
    // const subscription = await clerkClient.subscriptions.createSubscription({
    //   userId,
    //   priceId: "price_123456",
    // });

    const subscription = { plan: "Premium", userId }; // temporary mock

    res.json({ success: true, subscription });
  } catch (err) {
    console.error("Payment route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/payment/switch-free
router.post("/switch-free", async (req, res) => {
  const { userId } = req.body;

  try {
    // Mock: downgrade user plan
    // Real code: use clerkClient to downgrade subscription
    res.json({ success: true, message: `User ${userId} switched to Free plan` });
  } catch (err) {
    console.error("Switch free route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;*/




// paymentRoutes.js
import express from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";

const router = express.Router();

// Temporary mock function for payment verification
async function verifyPayment(method, transactionId) {
  // ✅ Demo purposes: সব payment pass হবে
  if (!method || !transactionId) return false;
  return true;
}

// POST /api/payment/pay-premium
router.post("/pay-premium", async (req, res) => {
  const { userId, method, transactionId } = req.body;

  try {
    const paymentVerified = await verifyPayment(method, transactionId);
    if (!paymentVerified) return res.status(400).json({ error: "Payment failed" });

    // Mock subscription creation
    const subscription = { plan: "Premium", userId };

    res.json({ success: true, subscription });
  } catch (err) {
    console.error("Payment route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/payment/switch-free
router.post("/switch-free", async (req, res) => {
  const { userId } = req.body;

  try {
    // Mock: downgrade user plan
    res.json({ success: true, message: `User ${userId} switched to Free plan` });
  } catch (err) {
    console.error("Switch free route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

