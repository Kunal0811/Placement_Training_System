import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiLock, FiUser } from 'react-icons/fi';
import axios from 'axios';
import API_BASE from '../../api';

export default function AdminLogin() {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE}/api/admin/login`, { admin_id: adminId, password });
            
            // 🔥 FIXED: Using sessionStorage so it wipes when the browser closes!
            sessionStorage.setItem("adminUser", JSON.stringify(res.data.user));
            
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || "Login failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 text-white">
            <div className="bg-[#1E293B] p-8 rounded-3xl w-full max-w-md border border-gray-700 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                        <FiShield />
                    </div>
                    <h2 className="text-3xl font-bold font-display">Admin Portal</h2>
                    <p className="text-gray-400 text-sm mt-2">Restricted access only.</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Admin ID</label>
                        <div className="relative">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input 
                                type="text" 
                                value={adminId}
                                onChange={e => setAdminId(e.target.value)}
                                className="w-full bg-[#0F172A] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-red-500 transition-colors"
                                placeholder="Enter Admin ID"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input 
                                type="password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-[#0F172A] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-red-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-red-500/25">
                        Secure Login
                    </button>
                </form>
                <button onClick={() => navigate('/')} className="w-full text-center text-gray-500 hover:text-white mt-6 text-sm">
                    Return to Student Login
                </button>
            </div>
        </div>
    );
}