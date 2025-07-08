import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { RemoveFromCart } from '../features/CartSlice'


function Cart() {
  const cartData = useSelector((state) =>state.cart)
  const dispatch = useDispatch()

  const HandleRemoveFromCart = (item) =>{
      console.log('Removing item with ID:', item.id);
    dispatch( RemoveFromCart(item.id))
  }

 return(
  <div>
  {
    Array.isArray(cartData) && cartData.length ===0 ? (
       <p className="text-center mt-10 text-gray-500">Your cart is empty.</p>
    ) :(
         
           <div className="min-h-screen bg-white text-black">
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
     {cartData && cartData.map((item)=>(
            <div key={item.id} className="border rounded p-4 shadow bg-gray-100">
            <img
              src={item.image}
              alt={item.title}
              className="h-40 w-full object-contain mb-4"
            />
            <h2 className="text-base font-semibold mb-2">{item.title}</h2>
              <p className="text-green-600 font-bold">${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            <button
              className="mt-2 px-4 py-2 border border-gray-600 text-gray-700 rounded hover:bg-gray-700 hover:text-white transition"
              onClick={()=>HandleRemoveFromCart(item)}
              >Removefromcart</button>
          </div>
     ))}
      </div>
    </div>
  </div>
       
    )
  
  }
  </div>
 )
}

export default Cart