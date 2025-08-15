import { useState, useEffect } from "react";
import {signInWithEmailAndPassword} from 'firebase/auth'
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ()=>{
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error , setError] = useState('')


 
    const navigate = useNavigate()

    const handleLogin = async (e)=>{
       const friendlyErrors = {
  "auth/invalid-email": "Invalid email address.",
  "auth/wrong-password": "Incorrect password.",
  "auth/email-already-in-use": "That email is already registered.",
};
        e.preventDefault()

        try {
            const userCredentail = await signInWithEmailAndPassword(auth, email, password)
             console.log("Logged in:", userCredentail.user);
             toast.success('logged in sucessfully')
          navigate('/')

        } catch (error) {
            console.error("Login error:", error.message);
            toast.error(error.message)
            setError( friendlyErrors[error.code]||error.message)
        }
    }

      // useEffect(()=>{
      //     setEmail('')
      //     setPassword('')
      //   })

    return(
        <div className="flex justify-center items-center h-screen bg-gray-100">
    <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
      <h2 className="text-4xl p-2 font-extrabold text-center bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-6">Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-3 py-2 bg-white text-black border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-3 py-2 bg-white text-black border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Login
      </button>
            <div className="mt-4 text-center">
  <p className="text-gray-600">
    Don’t have an account?{" "}
    <button
      type="button"
      onClick={() => navigate("/signup")}
      className="text-blue-600 hover:underline font-medium"
    >
      Sign up here
    </button>
  </p>
</div>
    </form>
 
    <div>
    {error && <p  className="text-red-500 text-sm text-center">{error}</p>}
  </div>
  

  </div>
  

    )
}

export default Login