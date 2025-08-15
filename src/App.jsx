import { useEffect, useState } from 'react'
import './App.css'
import { getProducts } from './service/api'
import {useDispatch, useSelector} from 'react-redux'
import { AddToCart } from './features/CartSlice'
import Navbar from './components/Navbar'
import{Routes, Route} from 'react-router-dom'
import Cart from './pages/Cart'
import Login from './components/Login'
import Signup from './components/Signup'
import { onAuthStateChanged,setPersistence,browserSessionPersistence } from 'firebase/auth'
import { auth } from './firebase/firebase'
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Footer from './components/Footer'

function App() {
  const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({})
  const [user, setUser] = useState(null)
const [authChecked, setAuthChecked] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const navigate = useNavigate()
  const dispatch = useDispatch()

const cart = useSelector((state) => state.cart)

useEffect(()=>{
  if(typeof window !=='undefined'){
  sessionStorage.setItem('cart', JSON.stringify(cart))
  }
},[cart])

setPersistence(auth,browserSessionPersistence)

useEffect(()=>{
  const unsubscribe = onAuthStateChanged(auth,(currentuser)=>{
setUser(currentuser)
setAuthChecked(true)
 
  });
  return ()=> unsubscribe();
})

  const handleAddToCart = (product)=>{

if (!user){
   toast.info("Please log in or sign up to add items to your cart");
  navigate("/login");
  return;
}

    const selectedQuantity = quantities[product.id] || 1
    if(selectedQuantity <1 || selectedQuantity>5) return;
    dispatch(AddToCart({...product, quantity: selectedQuantity}))
    setQuantities((prev) => ({...prev, [product.id]: 1}))
  }
useEffect(()=>{
 
  const fetchData = async ()=>{
    try {
      const data = await getProducts()
     
      setProducts(data)
    } catch (error) {
      setError(error.message)
    }finally{
      setLoading(false)
    }
  }
fetchData()
},[user])
  
const filteredproducts = products.filter(product =>
          product.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())||
  product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  product.category.toLowerCase().includes(searchTerm.toLowerCase())
        )

if(loading) return <p className="text-center mt-10">Loading...</p>;
if(error) return  <p className="text-center mt-10 text-red-500">Error: {error}</p>;
if (!authChecked) return <p className="text-center mt-10">Checking authentication...</p>;
return (
  <>
  <div className="flex flex-col min-h-screen bg-white">
  <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light"
  />
  <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
  <Routes>
    <Route path='/' element={

      <div className="min-h-screen bg-white text-black">
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
     {filteredproducts.length > 0 ? (
  filteredproducts.map(product => {
    const qty = quantities[product.id] || 1;
    return (
      <div key={product.id} className="border rounded p-4 shadow bg-gray-100">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/150"}
          alt={product.title}
          className="h-40 w-full object-contain mb-4"
        />
        <h2 className="text-base font-semibold mb-2">{product.title}</h2>
        <div>
          <p className="text-green-600 font-bold">${product.price}</p>
          <label htmlFor="quantity"> quantity </label>
          <input
            type="number"
            placeholder="enter quantity"
            value={qty}
            onChange={(e) => {
              setQuantities({
                ...quantities,
                [product.id]: Number(e.target.value),
              });
            }}
            className="border rounded px-2 py-1 w-16"
          />
        </div>
        <button
          onClick={() => handleAddToCart(product)}
          disabled={qty < 1 || qty > 5}
          className={`mt-2 px-4 py-2 rounded transition ${
            qty >= 1 && qty <= 5
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>
      </div>
    );
  })
) : (
  <p className="col-span-full text-center text-gray-500 text-lg mt-10">
    ❌ No products match your search.
  </p>
)}

      </div>
    </div>
  </div>

    }/>

    <Route path='/cart' element={<Cart/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route  path='/signup' element={<Signup/>}/>
  </Routes>
  <Footer />
  </div>
  </>
);

}

export default App
