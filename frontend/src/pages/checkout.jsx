import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth'; // Assuming you have this hook from previous code
import img1 from '/Payment.jpeg';

const PaymentPage = () => {
  const [transactionId, setTransactionId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Fake UPI QR Code for demo (Replace 'data=' with your actual UPI ID or Payment URL)
  const qrCodeUrl = img1;

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!transactionId) {
      alert("Please enter the Transaction ID");
      return;
    }

    setLoading(true);

    try {
      // Call the backend to finalize the order and save the Transaction ID
      const response = await fetch('http://localhost:5000/api/cart/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ transactionId }) // Sending the ID to backend
      });

      if (response.ok) {
        // Show the success popup
        setShowModal(true);
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/'); // Redirects to Products/Home page
        }, 3000);
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Scan to Pay</h1>
        
        {/* QR Code Display */}
        <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block mb-6">
          <img src={qrCodeUrl} alt="Payment QR Code" className="w-52 h-52 mx-auto" />
          <p className="text-sm text-gray-500 mt-2">Scan with any UPI App</p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePayment} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction ID / UTR
            </label>
            <input 
              type="text" 
              placeholder="Enter Transaction ID (e.g. 1234567890)" 
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold transition duration-200 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
          >
            {loading ? 'Processing...' : 'Click to Pay'}
          </button>
        </form>
      </div>

      {/* --- SUCCESS POPUP MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm mx-4 transform transition-all scale-100">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Booked!</h3>
            <p className="text-gray-600 mb-6">
              Payment confirmation will be received shortly.
            </p>
            <p className="text-sm text-gray-400">Redirecting to shop...</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentPage;