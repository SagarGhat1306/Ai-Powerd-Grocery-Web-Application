import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const AdminLogin = () => {

    const { setUser,backendUrl,user,setShowuserLogin, navigate } = useAppContext();

    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(''); // State for red <p> tag

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg(''); // Reset error before trying

        try {
            const response = await fetch(`${backendUrl}/api/admin/login` ,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                setUser(true);
                setShowuserLogin(false);
                navigate('/add-product')
            } else {
                // If login fails, set the error message and toast
                setErrorMsg(data.message);
                toast.error(data.message);
            }
        } catch (error) {
            setErrorMsg("Network error. Please try again.");
            toast.error("Error connecting to server");
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4'>

            <form onSubmit={handleLogin} className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">

                <h1 className="text-gray-900 text-3xl mt-10 font-medium">
                    {isSignup ? "Sign Up" : "Admin Login"}
                </h1>

                {/* ERROR MESSAGE TAG */}
                {errorMsg ? (
                    <p className="text-red-500 text-sm mt-2 font-medium">{errorMsg}</p>
                ) : (
                    <p className="text-gray-500 text-sm mt-2">
                        {isSignup ? "Create your account" : "Please sign in to continue"}
                    </p>
                )}

                {/* EMAIL INPUT - Red border if errorMsg exists */}
                <div className={`flex items-center w-full mt-6 border ${errorMsg ? 'border-red-500' : 'border-gray-300/80'} h-12 rounded-full overflow-hidden pl-6 transition-all`}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email id"
                        className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
                        required
                    />
                </div>

                {/* PASSWORD INPUT - Red border if errorMsg exists */}
                <div className={`flex items-center mt-4 w-full border ${errorMsg ? 'border-red-500' : 'border-gray-300/80'} h-12 rounded-full overflow-hidden pl-6 transition-all`}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="bg-transparent text-gray-500 outline-none text-sm w-full h-full"
                        required
                    />
                </div>

                {!isSignup && (
                    <div className="mt-5 text-left text-indigo-500">
                        <a className="text-sm" href="#">Forgot password?</a>
                    </div>
                )}

                <button
                    type="submit"
                    className="mt-6 w-full h-11 rounded-full text-white bg-primary hover:opacity-90 transition-opacity font-semibold"
                >
                    {isSignup ? "Create Account" : "Login"}
                </button>

                <p className="text-gray-500 text-sm mt-3 mb-11">
                    {isSignup ? "Already have an account?" : "Don’t have an account?"}
                    <span
                        onClick={() => {
                            setIsSignup(!isSignup);
                            setErrorMsg(''); // Clear error when switching
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

export default AdminLogin