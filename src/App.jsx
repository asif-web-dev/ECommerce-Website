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
import {ToastContainer} from 'react-toastify'
import { useNavigate } from 'react-router-dom'


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
  if(user){
  fetchData()
  }else{
    setProducts([])
    setLoading(false)
  }
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
     user ?  (
      <div className="min-h-screen bg-white text-black">
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(product => {
            const qty = quantities[product.id] || 1;
          return(
          <div key={product.id} className="border rounded p-4 shadow bg-gray-100">
            <img
              src={product.image}
              alt={product.title}
              className="h-40 w-full object-contain mb-4"
            />
            <h2 className="text-base font-semibold mb-2">{product.title}</h2>
            <div>
            <p className="text-green-600 font-bold">${product.price}</p>
            <label htmlFor="quantity"> quantity  </label>
          <input type="number"
         
          placeholder='enter quantity'
          value={qty}
          onChange={(e)=>{
            setQuantities({...quantities,[product.id]:Number(e.target.value)})
             className="border rounded px-2 py-1 w-16"
          }}
          />
         </div> 
  <button onClick={()=>handleAddToCart(product)}
  disabled={qty <1 || qty >5}
  className={`mt-2 px-4 py-2 rounded transition ${
   qty >= 1 && qty <= 5
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-400 text-white cursor-not-allowed"
  }`}>  Add to Cart
</button>
          </div>
          )
    })}
      </div>
    </div>
  </div>
) :(
 <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
  <div className="text-center space-y-4 px-4">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
      Welcome to <span className="text-blue-500">ShopMate</span>
    </h1>
    <p className="text-lg sm:text-xl text-gray-300">
      Please login or Signup to view our latest products and offers.
    </p>
   
    <button
      onClick={() => navigate('/login')}
      className="mt-4 m-6 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold shadow-md"
    >
      Login Now
    </button>
    <button onClick={()=> navigate('/signup')}
          className="mt-4 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold shadow-md"
    >
      Signup
    </button>

  </div>
</div>

)
    }/>

    <Route path='/cart' element={<Cart/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route  path='/signup' element={<Signup/>}/>
  </Routes>
  </>
);





}

export default App
