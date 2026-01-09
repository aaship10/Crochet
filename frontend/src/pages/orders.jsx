import React, { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import Footer from './components/footer';

function Orders() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401) {
          // not authorized
          navigate('/login');
          return;
        }

        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto bg-indigo-50 rounded-lg p-6 shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-indigo-900">Your Orders</h1>

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-600">You have no orders yet.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map(order => {
                // metadata may be JSON-encoded or an object
                let meta = order.metadata;
                try {
                  if (typeof meta === 'string') meta = JSON.parse(meta);
                } catch {
                  // ignore
                }

                return (
                  <li key={order.id} className="bg-white p-4 rounded-md shadow-sm">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="font-bold">Order #{order.id}</div>
                        <div className="text-gray-500 text-sm">{order.created_at ? new Date(order.created_at).toLocaleString() : '—'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-indigo-700">${order.total ?? (meta?.total ?? '0.00')}</div>
                      </div>
                    </div>

                    {meta && meta.items && Array.isArray(meta.items) && (
                      <div className="mt-3 border-t pt-3">
                        <div className="text-sm text-gray-700 font-medium mb-2">Items</div>
                        <ul className="space-y-2">
                          {meta.items.map((it, i) => (
                            <li key={i} className="flex justify-between text-sm">
                              <span>{it.name || it.product_name || 'Item'}</span>
                              <span className="text-gray-600">x{it.quantity ?? 1}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Orders;
