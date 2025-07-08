import { useEffect, useState } from "react";
import{createUserWithEmailAndPassword} from 'firebase/auth'
import{auth} from '../firebase/firebase'
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { db } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';



const Signup = ()=>{
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('')
    const[error,setError] = useState('')
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');


    const handleSubmit = async(e)=>{
             const friendlyErrors = {
  "auth/invalid-email": "Invalid email address.",
  "auth/wrong-password": "Incorrect password.",
  "auth/email-already-in-use": "That email is already registered.",
};
        e.preventDefault();

        try {
            const userCredentail =  await createUserWithEmailAndPassword(auth,email,password)
            const user = userCredentail.user
            await setDoc(doc(db,'users',user.uid),{
              uid : user.uid,
              email: user.email,
              firstName,
              lastName,
            });
             console.log("Signed up:", userCredentail.user);
             toast.success(`welcome ${firstName}`)
           setEmail('');
setPassword('');
navigate('/');

            
        } catch (error) {
            console.log('signup error', error.message);
            toast.error(error.message)
            setError(friendlyErrors[error.code]|| error.message)

            
        }

    }

    // useEffect(()=>{
    //   setEmail('')
    //   setPassword('')
    // })

    return(
       <div className="flex justify-center items-center h-screen bg-gray-100">
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
      <h2 className="text-xl font-bold text-center">Sign Up</h2>
      <input
  type="text"
  placeholder="First Name"
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-3 py-2 bg-white text-black border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"

  required />

<input
  type="text"
  placeholder="Last Name"
  value={lastName}
  onChange={(e) => setLastName(e.target.value)}
          className="w-full px-3 py-2 bg-white text-black border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"

  required
 />

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
        min={6}
        className="w-full px-3 py-2 bg-white text-black border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"

        required
      />
      <button  type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Sign Up
      </button>
    </form>
    <div>
      {error && <p  className="text-red-500 text-sm text-center">{error}</p> }
    </div>
  </div>
    )

}

export default Signup