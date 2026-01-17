import React, { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Footer from './components/footer';

function Orders() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- UTILITY: Format Date ---
  const formatDate = (dateString) => {
    if (!dateString) return 'Date N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // --- UTILITY: Status Badge Logic ---
  const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : 'pending';
    
    switch (s) {
      case 'paymentpending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paymentverified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'outfordelivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-stone-800 text-white border-stone-800';
      case 'transactioninvalid':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
     if (status === 'paymentPending') return 'Processing';
     if (status === 'paymentVerified') return 'Confirmed';
     if (status === 'outForDelivery') return 'On The Way';
     if (status === 'transactionInvalid') return 'Payment Failed';
     return status; // 'Delivered'
  }

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401) {
          navigate('/login');
          return;
        }

        if (!res.ok) throw new Error('Failed to fetch orders');
        
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  return (
    <>
    <title>Orders</title>
    <div className="flex flex-col min-h-screen bg-stone-50 font-sans text-stone-800">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-stone-200 py-12">
        <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">Order History</h1>
            <p className="text-stone-500 mt-2">Track your past purchases.</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        
        {loading ? (
          // --- LOADING SKELETON ---
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white h-32 rounded-xl shadow-sm border border-stone-100 animate-pulse"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          // --- EMPTY STATE ---
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                📦
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">No orders yet</h2>
            <p className="text-stone-500 mb-8">You haven't placed any orders with us yet.</p>
            <Link 
                to="/product" 
                className="inline-block bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg"
            >
                Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md">
                  
                  <div className="w-full md:w-32 h-32 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0 border border-stone-100">
                      {item.image ? (
                        <img 
                            src={item.image.startsWith('http') ? item.image : item.image} 
                            alt={item.product_name} 
                            className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🧶</div>
                      )}
                  </div>

                  <div className="flex-grow flex flex-col justify-between">
                      <div>
                          <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold text-stone-900">{item.product_name}</h3>
                                <p className="text-xs text-stone-400 mt-1 uppercase tracking-wide">
                                    Purchased: {formatDate(item.created_at)}
                                </p>
                                <p className="text-xs text-stone-400 mt-1 uppercase tracking-wide">
                                    Delivered: {formatDate(item.delivery_date)} 
                                </p>
                              </div>
                              <p className="font-serif font-bold text-lg text-stone-900">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                          </div>
                          
                          <div className="mt-2 text-sm text-stone-500">
                              {item.colour && <span className="mr-3">Colour: <span className="text-stone-700 font-medium">{item.colour}</span></span>}
                              <span>Qty: <span className="text-stone-700 font-medium">{item.quantity}</span></span>
                          </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100">
                           <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyle(item.status)}`}>
                                {getStatusLabel(item.status)}
                           </div>
                           
                           {item.transaction_id && (
                               <span className="text-xs font-mono text-stone-400">Txn: {item.transaction_id}</span>
                           )}
                      </div>
                  </div>
                </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
    </>
  );
}

export default Orders;