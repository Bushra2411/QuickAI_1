import React from 'react'
import { PricingTable } from '@clerk/clerk-react'

const Plan = () => {
  return (
    <div className='max-w-2xl mx-auto z-20 my-30'>
     <div className='text-center'>
        <h2 className='text-slate-700 text-[42px] font-semibold'>Choose Your Plan</h2>
        <p className='text-gray-500 max-w-lg mx-auto'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias omnis hic, ea tempora eos quo at voluptatum.</p>
     </div>
     <div className='mt-14 max-sm:mx-8'>
        <PricingTable />
     </div>
    </div>
  )
}

export default Plan

/*import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth, useUser } from "@clerk/clerk-react"; // ✅ useUser added

export default function Plan() {
  const { getToken } = useAuth();
  const { isLoaded, user } = useUser(); // ✅ full user info
  const [showModal, setShowModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    method: "",
    transactionId: "",
    contact: "",
  });
  const [isPaid, setIsPaid] = useState(false);

  // Submit payment handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !isLoaded) {
      alert("User not loaded yet. Try again.");
      return;
    }
    if (!paymentInfo.method || !paymentInfo.transactionId || !paymentInfo.contact) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const token = await getToken();
     const res = await fetch("http://localhost:3000/api/payment/pay-premium", 
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          ...paymentInfo,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsPaid(true);
        setShowModal(false);
        alert("Payment verified! Your Premium plan is now active.");
      } else {
        alert("Payment verification failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  // Switch to Free Plan
 const handleSwitchFree = async () => {
  if (!user || !isLoaded) {
    alert("User not loaded yet. Try again.");
    return;
  }
  try {
    const token = await getToken();
    const res = await fetch("http://localhost:3000/api/payment/switch-free", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: user.id }),
    });

    const data = await res.json();
    if (data.success) {
      setIsPaid(false);
      alert("You have switched to Free plan.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
};

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Plan</h1>
      <p className="text-gray-500 mb-10 text-center max-w-md">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias omnis hic,
        ea tempora eos quo at voluptatum.
      </p>

      
      <div className="flex gap-8">
       
        <div className="border border-gray-300 rounded-xl p-6 w-64 text-center shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Free</h2>
          <p className="text-2xl font-bold mb-4">৳ 0</p>
          <ul className="text-gray-600 text-sm mb-4 space-y-1">
            <li>✓ Title Generation</li>
            <li>✓ Article Generation</li>
            <li>✓ Summarizer</li>
            <li>✓ Translator</li>
          </ul>
          <button
            onClick={handleSwitchFree}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
          >
            Switch to Free
          </button>
        </div>

        
        <div className="border border-gray-300 rounded-xl p-6 w-64 text-center shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Premium</h2>
          <p className="text-2xl font-bold mb-4">৳ 500</p>
          <ul className="text-gray-600 text-sm mb-4 space-y-1">
            <li>✓ Title Generation</li>
            <li>✓ Article Generation</li>
            <li>✓ Generate Images</li>
            <li>✓ Remove Background</li>
            <li>✓ Remove Object</li>
            <li>✓ Review Resume</li>
          </ul>

          {isPaid ? (
            <button className="bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed">
              Already Subscribed
            </button>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Subscribe Now
            </button>
          )}
        </div>
      </div>

     
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-96 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4 text-center">Payment Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Payment Method</label>
                <select
                  value={paymentInfo.method}
                  onChange={(e) =>
                    setPaymentInfo({ ...paymentInfo, method: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select Method</option>
                  <option value="Bkash">Bkash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Transaction ID</label>
                <input
                  type="text"
                  placeholder="Enter Transaction ID"
                  value={paymentInfo.transactionId}
                  onChange={(e) =>
                    setPaymentInfo({ ...paymentInfo, transactionId: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Contact Number</label>
                <input
                  type="text"
                  placeholder="Enter Contact Number"
                  value={paymentInfo.contact}
                  onChange={(e) =>
                    setPaymentInfo({ ...paymentInfo, contact: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {isPaid && (
        <div className="mt-10 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          🎉 Payment Successful! You now have access to Premium features.
        </div>
      )}
    </div>
  );
}*/
