import {createSlice} from '@reduxjs/toolkit'


const savedCart = localStorage.getItem('cart')

const cartSlice = createSlice({
    name: 'cart',
    initialState: savedCart? JSON.parse(savedCart): [],
    reducers:{
        AddToCart :(state, action)=>{
            const existing = state.find(item =>item.id === action.payload.id)
            if(existing){
                existing.quantity += action.payload.quantity;
            }else{
 
                state.push({...action.payload, quantity: action.payload.quantity})
            }
           
        },
        RemoveFromCart :(state, action)=>{
            const item = state.find(i => i.id === action.payload)
            if(item){
                if(item.quantity>1){
                item.quantity -= 1
                }else{
   return state.filter(item => item.id !== action.payload);
            }
            }
         
        }
    }
})

export const {AddToCart,RemoveFromCart} = cartSlice.actions;
export default cartSlice.reducer