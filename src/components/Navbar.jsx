// components/Navbar.jsx
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import Cart from '../pages/Cart';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiLogOut } from 'react-icons/fi';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

const Navbar = ({searchTerm,setSearchTerm}) => {
  const cartItems = useSelector((state) => state.cart);
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const navigate = useNavigate();
  const [user, setUser] = useState(null)

useEffect(()=>{
  const unsubscribe = onAuthStateChanged(auth,(currentuser)=>{
    setUser(currentuser)
  })
  return ()=> unsubscribe()
})
  const handlelogout = async () => {
    await signOut(auth)
    toast.success('logged out sucessfully')
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate('/')}
        >
          ShopMate
        </div>

        {/* Search */}
<div className="relative w-full md:w-1/3">
  <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
      />
    </svg>
  </span>
  <input
    type="text"
    placeholder="Search products..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-200 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  />
</div>


        {/* Auth + Cart */}
        <div className="flex items-center gap-4">
          {user ? (<button
  onClick={handlelogout}
  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow-sm"
>
  <FiLogOut /> Logout
</button>) : (
    <div className='flex gap-4'>
           <button    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow-sm"
            onClick={() => navigate('/login')}
          >
             <FiLogIn />
            Login</button>
          <button     className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 shadow-sm"
            onClick={() => navigate('/signup')}
          >
            <FiUserPlus />
            Signup</button>
    </div>
  )}
     

          {/* Cart Icon with Badge */}
          <div className="relative cursor-pointer"
            onClick={() => navigate('/Cart')}
          >
            <span className="text-xl">🛒</span>


            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
