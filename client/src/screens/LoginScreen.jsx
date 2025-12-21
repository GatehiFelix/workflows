import { useState } from "react";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Remember Me:", rememberMe);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-teal-200 flex items-center justify-start p-4 relative overflow-hidden">
            {/* WhatsApp-inspired background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Soft green circles */}
                <div className="absolute top-10 right-20 w-96 h-96 bg-green-300/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-teal-300/25 rounded-full blur-3xl"></div>
            </div>

            {/* Login card positioned to the left - INCREASED SIZE */}
            <div className="relative z-10 w-full max-w-lg ml-0 md:ml-20 lg:ml-32 bg-white/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/60">
                <h1 className="text-5xl font-bold text-gray-800 mb-3">
                    Welcome 👋
                </h1>
                <p className="text-gray-700 text-base mb-10">
                    Login to access your FlowTalk account 
                </p>

                <div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                        <input 
                            type="email" 
                            placeholder="user@flowtalk.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700 placeholder-gray-400"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                        <input 
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700 placeholder-gray-400"
                        />
                    </div>

                    <div className="flex items-center justify-between mb-8">
                        <label className="flex items-center text-sm text-gray-700">
                            <input 
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="mr-2 rounded-sm"  
                            />
                            Remember me
                        </label>
                        <button onClick={(e) => e.preventDefault()} className="text-sm text-emerald-700 hover:text-emerald-800">
                            Forgot password?
                        </button>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 rounded-full transition duration-200 mb-8 shadow-lg text-base"
                    >
                        Login
                    </button>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-white/60 text-gray-600 backdrop-blur-sm rounded">or Sign in with Google</span> 
                        </div>
                    </div>

                    <button
                        type="button"
                        className="w-full bg-white/95 hover:bg-white text-gray-700 font-medium py-4 rounded-full flex items-center justify-center gap-2 transition duration-200 border border-gray-200 shadow-md text-base"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LoginScreen;