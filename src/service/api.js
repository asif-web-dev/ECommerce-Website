// import axios from 'axios';

// export const getProducts = async () => {
//   const res = await axios.get('https://fakestoreapi.com/products');
//   return res.data;
// };


export const getProducts = async () => {
  const res = await fetch('https://dummyjson.com/products?limit=100');
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data.products;
};
