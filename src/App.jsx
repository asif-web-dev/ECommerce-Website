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
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/firebase'
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify'

function App() {
  const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({})
  const [user, setUser] = useState(null)
const [authChecked, setAuthChecked] = useState(false);

  const dispatch = useDispatch()

const cart = useSelector((state) => state.cart)

useEffect(()=>{
  if(typeof window !=='undefined'){
  sessionStorage.setItem('cart', JSON.stringify(cart))
  }
},[cart])

useEffect(()=>{
  const unsubscribe = onAuthStateChanged(auth,(currentuser)=>{
setUser(currentuser)
setAuthChecked(true)
  console.log("Firebase Auth User:", currentuser);
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
  <Navbar/>
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
  <div className="flex justify-center items-center h-screen text-center text-xl text-red-500">
      Please log in to view products.</div>
)
    }/>

    <Route path='/cart' element={<Cart/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route  path='/signup' element={<Signup/>}/>
  </Routes>
  </>
);



//   return (
//   <div className="p-4">
//     <h1 className="text-2xl font-bold mb-4">Products</h1>
//     <ul>
//       {Array.isArray(products) && products.map((product) => (
//         <li key={product.id} className="text-green-600">{product.image}</li>
//       ))}
//     </ul>
//   </div>
// );


}

export default App
