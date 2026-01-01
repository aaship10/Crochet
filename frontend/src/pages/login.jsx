import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';

function AuthPage() {
  // State to toggle between Login and Signup views
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app you'd authenticate with a server; here we set a simple flag
    localStorage.setItem('loggedIn', 'true');
    navigate('/');
  }; 

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow flex flex-col justify-center items-center'>
        
        {/* Main Container */}
        <div className='bg-fuchsia-200 flex flex-row rounded-xl overflow-hidden shadow-2xl max-w-5xl w-full m-10'>
          
          {/* LEFT SIDE: Informational / Toggle Text */}
          <div className='p-10 w-1/2 flex justify-center items-center flex-col gap-6 text-center'>
            <p className='text-6xl font-extrabold text-white drop-shadow-md'>
              {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
            </p>
            <span className='text-purple-900 text-lg font-medium'>
              {isLogin 
                ? 'Login to continue your booking journey.' 
                : 'Start your journey with us by creating an account.'}
            </span>
            <span className='text-indigo-600 font-semibold'>
              {isLogin ? "Don't have an account?" : "Already have an account?"} 
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className='ml-2 underline hover:text-indigo-800 transition-colors cursor-pointer'
              >
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </span>
          </div>

          {/* RIGHT SIDE: Form Area */}
          <div className='bg-indigo-300 w-1/2 flex flex-col justify-center items-center gap-6 p-10'>
            <h1 className='text-4xl font-extrabold text-white'>
              {isLogin ? 'Login to Account' : 'Create Account'}
            </h1>
            
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full px-8'>
              
              {/* Extra Field for Signup: Full Name */}
              {!isLogin && (
                <input 
                  type='text' 
                  placeholder='Full Name'
                  className='p-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all'
                />
              )}

              <input 
                type='email' 
                placeholder='Email'
                className='p-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all'
              />
              <input
                type='password'
                placeholder='Password'
                className='p-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all'
              />

              {/* Extra Field for Signup: Confirm Password */}
              {!isLogin && (
                 <input
                 type='password'
                 placeholder='Confirm Password'
                 className='p-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all'
               />
              )}

              <button
                type='submit'
                className='mt-4 p-3 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 transition-colors shadow-md'
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AuthPage;