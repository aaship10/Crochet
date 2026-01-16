import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth'; // Security Fix: Import auth hook

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900">
              Admin Dashboard
            </h1>
            <p className="text-stone-500 mt-2">Manage your boutique's orders and inventory.</p>
          </div>

          {/* Styled Tabs */}
          <div className="bg-white p-1.5 rounded-xl shadow-sm border border-stone-200 inline-flex">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === 'orders'
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              View Orders
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === 'products'
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              Manage Products
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden min-h-[600px]">
          {activeTab === 'orders' ? <OrderList /> : <ProductsManager />}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: ORDER LIST ---
const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth(); // Fix: Get token

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` } // Fix: Attach Token
      });
      // Sort by newest first
      const sorted = res.data.sort((a,b) => new Date(b.order_date) - new Date(a.order_date));
      setOrders(sorted);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(token) fetchOrders();
  }, [token]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } } // Fix: Attach Token
      );
      fetchOrders();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  // Status Helpers
  const isPaymentChecked = (s) => ['paymentVerified', 'outForDelivery', 'delivered'].includes(s);
  const isReadyChecked = (s) => ['outForDelivery', 'delivered'].includes(s);
  const isDeliveredChecked = (s) => s === 'delivered';
  const isInvalidChecked = (s) => s === 'transactionInvalid';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered': return 'bg-stone-900 text-white';
      case 'outForDelivery': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paymentVerified': return 'bg-green-100 text-green-800 border-green-200';
      case 'transactionInvalid': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-orange-100 text-orange-800 border-orange-200'; 
    }
  };

  if (loading) return <div className="p-12 text-center text-stone-400">Loading orders...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-serif font-bold text-stone-900">Recent Orders</h2>
        <span className="bg-stone-100 text-stone-600 px-4 py-1.5 rounded-full text-xs font-bold border border-stone-200">
          Total: {orders.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-100">
          <thead>
            <tr className="text-left text-xs font-bold text-stone-400 uppercase tracking-wider">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Item Details</th>
              {/* <th className='px-6 py-4'>Location</th> */}
              <th className="px-6 py-4">Txn ID</th>
              <th className="px-6 py-4">Workflow</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {orders.map((item) => (
              <tr key={item._id || item.id} className={`hover:bg-stone-50 transition-colors ${isInvalidChecked(item.status) ? 'bg-red-50/50' : ''}`}>
                
                <td className="px-6 py-4 text-sm font-mono text-stone-500">
                  {new Date(item.order_date).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-stone-900">{item.user_name}</div>
                  <div className="text-xs text-stone-400">{item.user_phone || 'No phone'}</div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm text-stone-800 font-medium">{item.product_name}</div>
                  <div className="text-xs text-stone-500 mt-1">
                    Qty: {item.quantity} • <span className="text-stone-900 font-bold">₹{item.price}</span>
                  </div>
                  {item.colour && (
                     <div className="mt-1 inline-block px-2 py-0.5 bg-stone-100 rounded text-[10px] text-stone-600 border border-stone-200">
                        {item.colour}
                     </div>
                  )}
                </td>

                {/* <td className="px-6 py-4">
                  <div className="text-sm text-stone-800 font-medium">{item.distance}</div>
                </td> */}

                <td className="px-6 py-4">
                  <div className={`text-xs font-mono px-2 py-1 rounded w-fit select-all ${item.transaction_id ? 'bg-stone-100 text-stone-700' : 'bg-red-100 text-red-600'}`}>
                    {item.transaction_id || 'MISSING'}
                  </div>
                </td>

                <td className="px-6 py-4 space-y-2">
                    {/* Invalid Checkbox */}
                    <label className={`flex items-center gap-2 text-xs font-bold cursor-pointer transition-colors ${isInvalidChecked(item.status) ? 'text-red-600' : 'text-stone-400 hover:text-red-500'}`}>
                        <input
                            type="checkbox"
                            className="accent-red-600 w-3 h-3"
                            checked={isInvalidChecked(item.status)}
                            disabled={isPaymentChecked(item.status)}
                            onChange={() => handleStatusUpdate(item._id || item.id, 'transactionInvalid')}
                        />
                        Mark Invalid
                    </label>

                    {/* Progress Flow */}
                    <div className={`pl-3 border-l-2 space-y-1 ${isInvalidChecked(item.status) ? 'border-red-200 opacity-40 pointer-events-none' : 'border-stone-200'}`}>
                        
                        <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer hover:text-stone-900">
                            <input
                                type="checkbox"
                                className="accent-green-600 w-4 h-4 rounded"
                                checked={isPaymentChecked(item.status)}
                                disabled={isPaymentChecked(item.status)}
                                onChange={() => handleStatusUpdate(item._id || item.id, 'paymentVerified')}
                            />
                            Payment Verified
                        </label>

                        <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer hover:text-stone-900">
                            <input
                                type="checkbox"
                                className="accent-blue-600 w-4 h-4 rounded"
                                checked={isReadyChecked(item.status)}
                                disabled={!isPaymentChecked(item.status) || isReadyChecked(item.status)}
                                onChange={() => handleStatusUpdate(item._id || item.id, 'outForDelivery')}
                            />
                            Out for Delivery
                        </label>

                        <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer hover:text-stone-900">
                            <input
                                type="checkbox"
                                className="accent-stone-900 w-4 h-4 rounded"
                                checked={isDeliveredChecked(item.status)}
                                disabled={!isReadyChecked(item.status) || isDeliveredChecked(item.status)}
                                onChange={() => handleStatusUpdate(item._id || item.id, 'delivered')}
                            />
                            Delivered
                        </label>
                    </div>
                </td>

                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                    {item.status === 'transactionInvalid' ? 'Invalid ID' : item.status}
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

// --- COMPONENT: PRODUCTS MANAGER ---
const ProductsManager = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-8 space-y-12">
      <AddProductForm onProductAdded={handleProductAdded} />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-white text-sm text-stone-400 font-medium tracking-wider uppercase">Inventory Management</span>
        </div>
      </div>

      <ProductInventory key={refreshKey} />
    </div>
  );
};

// --- COMPONENT: ADD PRODUCT FORM ---
const AddProductForm = ({ onProductAdded }) => {
  const [productData, setProductData] = useState({ name: '', price: '' });
  const [files, setFiles] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null]); // For visual feedback
  const [loading, setLoading] = useState(false);
  const { token } = useAuth(); // Fix: Get token

  const handleFileChange = (index, file) => {
    const updatedFiles = [...files];
    updatedFiles[index] = file;
    setFiles(updatedFiles);

    // Create preview URL
    const updatedPreviews = [...previews];
    if (file) {
        updatedPreviews[index] = URL.createObjectURL(file);
    } else {
        updatedPreviews[index] = null;
    }
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!token) return alert("Unauthorized");
    
    setLoading(true);
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    files.forEach((file) => {
        if(file) formData.append('productImages', file);
    });

    try {
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        }
      });
      alert("Product Added Successfully!");
      // Reset Form
      setProductData({ name: '', price: '' });
      setFiles([null, null, null, null]);
      setPreviews([null, null, null, null]);
      if (onProductAdded) onProductAdded();
    } catch (err) {
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="bg-stone-50 p-8 rounded-xl border border-stone-200 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
             <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Product Name</label>
             <input type="text" required value={productData.name} onChange={(e) => setProductData({ ...productData, name: e.target.value })} 
                className="w-full border border-stone-200 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all bg-white" 
                placeholder="e.g. Cozy Wool Scarf"
             />
          </div>
          <div>
             <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Price ($)</label>
             <input type="number" required value={productData.price} onChange={(e) => setProductData({ ...productData, price: e.target.value })} 
                className="w-full border border-stone-200 p-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all bg-white" 
                placeholder="0.00"
             />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase mb-4">Product Images (Upload up to 4)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((_, i) => (
              <div key={i} className="relative aspect-square">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(i, e.target.files[0])} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <div className={`w-full h-full rounded-xl border-2 border-dashed flex items-center justify-center transition-all overflow-hidden relative ${previews[i] ? 'border-orange-400 bg-white' : 'border-stone-300 hover:border-stone-400 bg-white'}`}>
                    {previews[i] ? (
                        <>
                            <img src={previews[i]} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">Change</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-2">
                           <span className="block text-2xl text-stone-300 mb-1">+</span>
                           <span className="text-xs text-stone-400 font-medium">Slot {i+1}</span>
                        </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-stone-900 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300">
          {loading ? 'Uploading...' : 'Add to Inventory'}
        </button>
      </form>
    </div>
  );
};

// --- COMPONENT: PRODUCT INVENTORY ---
const ProductInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth(); // Fix: Get token

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete product. It might be in an active order.");
    }
  };

  if (loading) return <p className="text-center text-stone-400 py-10">Syncing inventory...</p>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-bold text-stone-900">Current Stock</h2>
          <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-bold border border-stone-200">
            {products.length} Items
          </span>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center p-12 bg-stone-50 rounded-xl border border-dashed border-stone-200">
            <p className="text-stone-500">Inventory is empty.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 shadow-sm">
          <table className="min-w-full divide-y divide-stone-100">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Preview</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
              {products.map((product) => {
                 let displayImage = null;
                 if (product.images && product.images.length > 0) displayImage = product.images[0];
                 return (
                  <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="h-16 w-16 rounded-lg border border-stone-200 overflow-hidden bg-stone-100">
                        {displayImage ? (
                          <img 
                            src={displayImage} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-stone-400">No Img</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                        <div className="text-sm font-bold text-stone-900">{product.name}</div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">ID: {product.id}</div>
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-stone-600">${product.price}</td>
                    <td className="px-6 py-3 text-right">
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-stone-400 hover:text-red-600 font-medium text-sm transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                 );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;