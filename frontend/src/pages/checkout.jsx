import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth'; 
import img1 from '/Payment.jpeg';

const PaymentPage = () => {
  const [transactionId, setTransactionId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const qrCodeUrl = img1;

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!transactionId) {
      alert("Please enter the Transaction ID");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ transactionId }) 
      });

      if (response.ok) {
        setShowModal(true);
        setTimeout(() => {
          navigate('/orders'); 
        }, 3000);
      } else {
        alert("Payment verification failed. Please check the ID and try again.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong with the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <title>Checkout</title>
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans text-stone-800">
      
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-stone-100">
        
        <div className="w-full md:w-1/2 bg-stone-900 text-white p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 -mr-16 -mt-16"></div>
          
          <h2 className="text-3xl font-serif font-bold mb-2 relative z-10">Scan to Pay</h2>
          <p className="text-stone-400 mb-8 relative z-10">Secure Checkout via UPI</p>
          
          <div className="bg-white p-4 rounded-xl shadow-lg transform transition-transform hover:scale-105 duration-300 relative z-10">
            

[Image of QR code scanner]

            <img 
                src={qrCodeUrl} 
                alt="Payment QR Code" 
                className="w-48 h-48 object-contain" 
            />
          </div>
          
          <p className="text-xs text-stone-500 mt-6 relative z-10">
            Accepting GPay, PhonePe, Paytm, and BHIM
          </p>
        </div>

        {/* RIGHT SIDE: Form & Instructions */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-stone-900 mb-4">Payment Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-stone-600 marker:text-orange-500 marker:font-bold">
                <li>Open your preferred UPI app.</li>
                <li>Scan the QR code on the left.</li>
                <li>Complete the payment.</li>
                <li><strong>Important:</strong> Copy the 12-digit Transaction ID / UTR.</li>
                <li>Paste it below <strong>correctly</strong> to confirm your order.</li>
            </ol>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Transaction ID / UTR
              </label>
              <input 
                type="text" 
                placeholder="e.g. 3245 8901 2345" 
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-all font-mono"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-4 rounded-full font-bold shadow-lg transition-all duration-300 transform active:scale-95
                    ${loading 
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                        : 'bg-stone-900 text-white hover:bg-orange-600 hover:shadow-orange-200'
                    }`}
                >
                    {loading ? 'Verifying...' : 'Confirm Payment'}
                </button>
                
                <button 
                    type="button"
                    onClick={() => navigate('/cart')}
                    className="text-stone-400 hover:text-stone-600 text-sm font-medium transition-colors"
                >
                    Cancel and return to Cart
                </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- SUCCESS MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"></div>
            
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Order Confirmed!</h3>
                <p className="text-stone-500 mb-6">
                    Thank you for supporting our small business. We will start crafting your order immediately.
                </p>
                
                <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 animate-[width_3s_ease-in-out_forwards]" style={{width: '0%'}}></div>
                </div>
                <p className="text-xs text-stone-400 mt-2">Redirecting you...</p>
            </div>
        </div>
      )}

    </div>
    </>
  );
};

export default PaymentPage;