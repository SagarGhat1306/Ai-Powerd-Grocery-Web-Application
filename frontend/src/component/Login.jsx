import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const Login = () => {

  const { setUser, setShowuserLogin, backendUrl } = useAppContext()

  const [isSignup, setIsSignup] = useState(false)

  // FORM STATE
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // ERROR STATE
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    // ✅ VALIDATION
    if (!email || !password || (isSignup && !name)) {
      setErrorMsg("All fields are required")
      toast.error("Please fill all fields")
      return
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters")
      toast.error("Weak password")
      return
    }

    try {
      const url = isSignup
        ? `${backendUrl}/api/user/register`
        : `${backendUrl}/api/user/login`

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 IMPORTANT FOR COOKIES
        body: JSON.stringify({
          name,
          email,
          password
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(isSignup ? "Account created" : "Login successful")

        setUser(data.user)
        setShowuserLogin(false)

        // reset
        setName('')
        setEmail('')
        setPassword('')
        setErrorMsg('')
      } else {
        setErrorMsg(data.message)
        toast.error(data.message)
      }

    } catch (error) {
      setErrorMsg("Network error")
      toast.error("Server error")
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>

      <form onSubmit={handleSubmit} className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">

        {/* TITLE */}
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {isSignup ? "Sign Up" : "Login"}
        </h1>

        {/* 🔴 ERROR MESSAGE */}
        {errorMsg ? (
          <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
        ) : (
          <p className="text-gray-500 text-sm mt-2">
            {isSignup ? "Create your account" : "Please sign in to continue"}
          </p>
        )}

        {/* NAME */}
        {isSignup && (
          <div className={`flex items-center w-full mt-6 border ${errorMsg && !name ? 'border-red-500' : 'border-gray-300/80'} h-12 rounded-full pl-6`}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Full Name"
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        )}

        {/* EMAIL */}
        <div className={`flex items-center w-full mt-6 border ${errorMsg && !email ? 'border-red-500' : 'border-gray-300/80'} h-12 rounded-full pl-6`}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email id"
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* PASSWORD */}
        <div className={`flex items-center mt-4 w-full border ${errorMsg && !password ? 'border-red-500' : 'border-gray-300/80'} h-12 rounded-full pl-6`}>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* FORGOT */}
        {!isSignup && (
          <div className="mt-5 text-left text-indigo-500">
            <a className="text-sm" href="#">Forgot password?</a>
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          className="mt-4 w-full h-11 rounded-full text-white bg-primary hover:opacity-90"
        >
          {isSignup ? "Create Account" : "Login"}
        </button>

        {/* TOGGLE */}
        <p className="text-gray-500 text-sm mt-3 mb-11">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}

          <span
            onClick={() => {
              setIsSignup(!isSignup)
              setErrorMsg('')
            }}
            className="text-indigo-500 cursor-pointer ml-1"
          >
            {isSignup ? "Login" : "Sign up"}
          </span>
        </p>

      </form>
    </div>
  )
}

export default Login