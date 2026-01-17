import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './components/footer';
import { useAuth } from './useAuth';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(false); // Default to Register to show new fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const endpoint = isLogin ? '/auth/login' : '/auth/register';

  try {
    // Build request payload
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          password: formData.password,
        };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // Safe parsing: check content-type first
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    // Handle success or error
    if (response.ok) {
      if (isLogin) {
        login(data.token, data.user); // Save token in auth context
        navigate('/product');
      } else {
        alert('Registration successful! Please login.');
        setIsLogin(true); // switch to login form
      }
    } else {
      alert(data.error || data.message || 'Something went wrong.');
    }
  } catch (err) {
    console.error('Network or parsing error:', err);
    alert('An unexpected error occurred. Please try again later.');
  }
};

  
  return (
    <>
    <title>Register</title>
    <div className='flex flex-col min-h-screen bg-stone-50 font-sans text-stone-800'>
      <main className='flex-grow flex flex-col justify-center items-center py-12 px-4'>
        
        <div className='bg-white flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-xl max-w-5xl w-full border border-stone-100'>
          
          {/* --- LEFT SIDE: VISUALS --- */}
          
          <div className='hidden md:flex w-1/2 bg-orange-50 relative flex-col justify-center items-center text-center p-12'>
            {/* Background Image Overlay */}
            <div className="absolute inset-0 z-0">
                 {/* You can put an actual <img /> here with object-cover opacity-20 if you want */}
                 <div className="absolute inset-0 bg-stone-900/10"></div> 
            </div>
            
            <div className="relative z-10 space-y-6">
                <h2 className='text-4xl lg:text-5xl font-serif font-bold text-stone-900'>
                {isLogin ? 'Welcome Back!' : 'Join the Family'}
                </h2>
                <p className='text-stone-600 text-lg max-w-sm mx-auto'>
                {isLogin 
                    ? 'Login to access your saved items and track your orders.' 
                    : 'Create an account to enjoy exclusive offers, faster checkout, and order tracking.'}
                </p>
                <button 
                    onClick={() => setIsLogin(!isLogin)} 
                    className='inline-block px-8 py-3 border-2 border-stone-900 text-stone-900 font-bold rounded-full hover:bg-stone-900 hover:text-white transition-all duration-300'
                >
                    {isLogin ? 'Create an Account' : 'I have an account'}
                </button>
            </div>
          </div>

          {/* --- RIGHT SIDE: FORM --- */}
          <div className='w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center'>
            <h1 className='text-3xl font-serif font-bold text-stone-900 mb-8 text-center md:text-left'>
              {isLogin ? 'Login to Account' : 'Create Account'}
            </h1>
            
            <form onSubmit={handleSubmit} className='space-y-4'>
              
              {!isLogin && (
                <>
                    {/* Full Name */}
                    <div>
                        <input 
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            type='text' 
                            placeholder='Full Name'
                            className='w-full p-4 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all'
                            required
                        />
                    </div>
                    
                    {/* Phone Number */}
                    <div>
                        <input 
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            type='tel' 
                            placeholder='Phone Number'
                            className='w-full p-4 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all'
                            required
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <textarea 
                            name='address'
                            value={formData.address}
                            onChange={handleChange}
                            placeholder='Shipping Address'
                            rows="2"
                            className='w-full p-4 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all resize-none'
                            required
                        />
                    </div>
                </>
              )}

              {/* Email */}
              <div>
                <input 
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    type='email' 
                    placeholder='Email Address'
                    className='w-full p-4 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all'
                    required
                />
              </div>

              {/* Password */}
              <div>
                <input
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    type='password'
                    placeholder='Password'
                    className='w-full p-4 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all'
                    required
                />
              </div>

              {/* Confirm Password */}
              {!isLogin && (
                 <div>
                    <input
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        type='password'
                        placeholder='Confirm Password'
                        className='w-full p-4 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all'
                        required
                    />
                 </div>
              )}

              <button
                type='submit'
                className='w-full p-4 mt-6 bg-stone-900 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg'
              >
                {isLogin ? 'Sign In' : 'Register'}
              </button>
            </form>    
            
            {/* Mobile Toggle for Login/Register */}
            <div className='md:hidden mt-6 text-center'>
                <p className='text-stone-600'>
                    {isLogin ? "Don't have an account?" : "Already have an account?"} 
                    <button 
                        onClick={() => setIsLogin(!isLogin)} 
                        className='ml-2 font-bold text-orange-600'
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </div>
    </>
  );
}

export default AuthPage;