import React, { useState } from 'react';

const PaymentForm = () => {
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({ name, cardNumber, expiryDate, cvv });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Payment Form</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Transation No</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-md"
            placeholder="Jane Doe"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Transaction Type</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-md"
            placeholder="1234 5678 9012 3456"
          />
        </div>
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Expiry Date</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              placeholder="MM/YY"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              placeholder="123"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-700 text-white py-2 rounded-md hover:bg-emerald-800 transition duration-200"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
