'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // API Call to Backend (adjust port if needed, assuming 4000 based on context)
            // Note: User says "http://localhost:3000" in prompt but Backend is actually 4000.
            // We will use 4000 to ensure it works.
            const response = await axios.post('http://localhost:4000/auth/login', {
                email,
                password,
            });

            if (response.data.access_token) {
                // Success
                localStorage.setItem('everseal_token', response.data.access_token);
                router.push('/admin');
            }
        } catch (err: any) {
            // Failure
            console.error('Login Failed:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Login failed';
            setError(`Error: ${errorMessage}`);
            setShake(true);
            setTimeout(() => setShake(false), 500); // Reset shake
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            {/* Brand Header */}
            <div className="mb-8 flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4">
                    <ShieldCheck className="w-10 h-10 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">EverSeal Admin</h1>
                <p className="text-slate-500 mt-2">Secure Product Authentication System</p>
            </div>

            {/* Login Card */}
            <div
                className={`w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-transform duration-100 ${shake ? 'translate-x-1' : ''}`}
                style={shake ? { animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' } : {}}
            >
                <div className="p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Sign In</h2>
                        <p className="text-sm text-slate-500">Enter your credentials to access the dashboard.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 block">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 placeholder:text-slate-400"
                                    placeholder="admin@everseal.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 block">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer/Hint */}
                <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex flex-col items-center">
                    <p className="text-sm text-center text-slate-600 mb-3">
                        <span className="font-bold text-indigo-900 block mb-1">Visitor / Recruiter Demo:</span>
                        Use the credentials below to access the system.
                    </p>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 w-full text-center mb-3">
                        <p className="text-xs font-mono text-indigo-800">
                            Email: <span className="font-bold">admin@everseal.com</span>
                        </p>
                        <p className="text-xs font-mono text-indigo-800 mt-1">
                            Pass: <span className="font-bold">password123</span>
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setEmail('admin@everseal.com');
                            setPassword('password123');
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                    >
                        Tap to Auto-fill Credentials
                    </button>
                </div>
            </div>

            {/* Styles for shake animation */}
            <style jsx global>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
        </div >
    );
}
