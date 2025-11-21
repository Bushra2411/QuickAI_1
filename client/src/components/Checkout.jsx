import React from 'react';

const Checkout = () => {
  const handleBkashPayment = async () => {
    const res = await fetch('http://localhost:5000/api/bkash/create-payment', { method: 'POST' });
    const data = await res.json();
    window.location.href = data.bkashURL; // redirect to bKash sandbox/test
  };

  const handleNagadPayment = async () => {
    const res = await fetch('http://localhost:5000/api/nagad/create-payment', { method: 'POST' });
    const data = await res.json();
    window.location.href = data.nagadURL;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
        <p className="text-lg mb-6">
          Premium Plan – <strong>৳5500.00 / month</strong>
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleBkashPayment}
            className="flex items-center justify-center gap-3 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg"
          >
            <img src="/images/bkash.png" alt="bKash" className="w-6 h-6" />
            Pay with bKash
          </button>

          <button
            onClick={handleNagadPayment}
            className="flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
          >
            <img src="/images/nagad.png" alt="Nagad" className="w-6 h-6" />
            Pay with Nagad
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
