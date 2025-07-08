// components/Navbar.jsx
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import Cart from '../pages/Cart';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Navbar = () => {
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
        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Auth + Cart */}
        <div className="flex items-center gap-4">
          {user ? (<button
    onClick={handlelogout}
    className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
  >
    Logout
  </button>) : (
    <div className='space-x-4'>
           <button className="text-sm text-gray-600 hover:text-blue-600"
            onClick={() => navigate('/login')}
          >Login</button>
          <button className="text-sm text-gray-600 hover:text-blue-600"
            onClick={() => navigate('/signup')}
          >Signup</button>
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
