import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Admin Dashboard</h1>
          <nav className="flex space-x-4 bg-white p-2 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              View Orders
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'products' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Add Product
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'orders' ? <OrderList /> : <AddProductForm />}
        </div>
      </div>
    </div>
  );
};

// --- UPDATED Order List Component ---
const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/orders');
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Checkbox Clicks
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        status: newStatus
      });
      // Refresh the list to show new status
      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  };

  // Helper to determine if a checkbox should be checked based on current status
  const isPaymentChecked = (status) => ['paymentVerified', 'outForDelivery', 'delivered'].includes(status);
  const isReadyChecked = (status) => ['outForDelivery', 'delivered'].includes(status);
  const isDeliveredChecked = (status) => status === 'delivered';

  if (loading) return <div className="text-center py-10 text-gray-500">Loading orders...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Customer Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trans. ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workflow Actions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.order_date ? new Date(item.order_date).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.user_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {item.product_name} <span className="text-xs text-gray-400">(Qty: {item.quantity})</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                  {item.transaction_id || <span className="text-red-400">Not provided</span>}
                </td>
                
                {/* --- THE CHECKBOX COLUMN --- */}
                <td className="px-6 py-4 whitespace-nowrap text-sm space-y-1">
                  
                  {/* Checkbox 1: Payment Verification */}
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={isPaymentChecked(item.status)}
                      onChange={() => handleStatusUpdate(item.id, 'paymentVerified')}
                      disabled={isPaymentChecked(item.status)} // Disable if already verified
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
                    />
                    <label className={isPaymentChecked(item.status) ? "text-green-600 font-medium" : "text-gray-500"}>
                      1. Payment Verified
                    </label>
                  </div>

                  {/* Checkbox 2: Ready for Delivery */}
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={isReadyChecked(item.status)}
                      onChange={() => handleStatusUpdate(item.id, 'outForDelivery')}
                      disabled={!isPaymentChecked(item.status) || isReadyChecked(item.status)} // Disable if payment not done OR already ready
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
                    />
                    <label className={isReadyChecked(item.status) ? "text-blue-600 font-medium" : "text-gray-500"}>
                      2. Out for Delivery
                    </label>
                  </div>

                  {/* Checkbox 3: Delivered */}
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={isDeliveredChecked(item.status)}
                      onChange={() => handleStatusUpdate(item.id, 'delivered')}
                      disabled={!isReadyChecked(item.status) || isDeliveredChecked(item.status)} // Disable if not ready OR already delivered
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
                    />
                    <label className={isDeliveredChecked(item.status) ? "text-gray-800 font-bold" : "text-gray-500"}>
                      3. Delivered
                    </label>
                  </div>

                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                     ${item.status === 'delivered' ? 'bg-gray-800 text-white' : 
                       item.status === 'outForDelivery' ? 'bg-blue-100 text-blue-800' : 
                       item.status === 'paymentVerified' ? 'bg-green-100 text-green-800' : 
                       'bg-yellow-100 text-yellow-800'}`}>
                     {item.status}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- UPDATED Add Product Form ---
const AddProductForm = () => {
  const [productData, setProductData] = useState({ name: '', price: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState(null); // To store the result

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLastAddedProduct(null); // Clear previous result
    
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    if (file) formData.append('productImage', file);

    try {
      const res = await axios.post('http://localhost:5000/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // SUCCESS: Save the response (which contains the new image URL) to state
      setLastAddedProduct(res.data);
      
      // Reset form
      setProductData({ name: '', price: '' });
      setFile(null);
    } catch (err) {
      alert('Failed to add product');
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT SIDE: The Form */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Inventory</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              required
              value={productData.name}
              onChange={(e) => setProductData({...productData, name: e.target.value})}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              required
              value={productData.price}
              onChange={(e) => setProductData({...productData, price: e.target.value})}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Photo</label>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])} 
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])} 
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])} 
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])} 
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            {loading ? 'Uploading...' : 'Add Product'}
          </button>
        </form>
      </div>

      {/* RIGHT SIDE: The Preview (Reflects immediately) */}
      <div className="flex flex-col items-center justify-center border-l border-gray-200 pl-8">
        {lastAddedProduct ? (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center shadow-sm">
                <div className="mb-2 text-green-700 font-bold text-lg">✓ Product Added!</div>
                
                {/* DISPLAY THE IMAGE HERE */}
                {lastAddedProduct.image_url ? (
                    <img 
                        src={`${lastAddedProduct.image_url}`} 
                        alt="New Product" 
                        className="w-48 h-48 object-cover rounded-md mx-auto mb-4 border border-gray-300"
                    />
                ) : (
                    <div className="w-48 h-48 bg-gray-200 rounded-md mx-auto mb-4 flex items-center justify-center text-gray-500">No Image</div>
                )}
                
                <h3 className="text-xl font-bold text-gray-800">{lastAddedProduct.name}</h3>
                <p className="text-gray-600 text-lg">${lastAddedProduct.price}</p>
            </div>
        ) : (
            <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">📷</div>
                <p>Upload a product to see it appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;