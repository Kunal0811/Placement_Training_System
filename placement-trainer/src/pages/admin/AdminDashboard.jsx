import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiCalendar, FiBookOpen, FiLogOut, FiPlus, FiTrash2, FiClock, FiSearch, FiAward, FiArrowLeft, FiActivity, FiCode, FiAlertTriangle, FiMail, FiTarget, FiFileText, FiYoutube, FiGithub, FiHeadphones, FiImage, FiGlobe } from 'react-icons/fi';
import axios from 'axios';
import API_BASE from '../../api';
import Navbar from '../../components/Navbar'; 
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('tests'); 
    const [stats, setStats] = useState({ total_users: 0, total_tests: 0 });
    const [loading, setLoading] = useState(false);

    // Tests & Users State
    const [tests, setTests] = useState([]);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('aptitude');
    const [scheduledTime, setScheduledTime] = useState('');
    const [duration, setDuration] = useState(60);
    const [selectedTestForResults, setSelectedTestForResults] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentProfile, setStudentProfile] = useState(null);

    // Resources State
    const [resources, setResources] = useState([]);
    const [resTitle, setResTitle] = useState('');
    const [resDesc, setResDesc] = useState('');
    const [resCategory, setResCategory] = useState('Aptitude');
    const [resType, setResType] = useState('PDF');
    const [resUrl, setResUrl] = useState('');
    const [resFile, setResFile] = useState(null); 

    const fetchDashboardData = async () => {
        try {
            const statsRes = await axios.get(`${API_BASE}/api/admin/stats`);
            setStats(statsRes.data);
            const testsRes = await axios.get(`${API_BASE}/api/admin/tests`);
            setTests(testsRes.data);
            const usersRes = await axios.get(`${API_BASE}/api/admin/users`);
            setUsersList(usersRes.data);
            
            const resourceRes = await axios.get(`${API_BASE}/api/resources/`);
            setResources(resourceRes.data);
        } catch (err) { console.error("Failed to fetch admin data", err); }
    };

    useEffect(() => {
        const adminUser = sessionStorage.getItem('adminUser');
        if (!adminUser) return navigate('/admin/login');
        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    // --- Handlers ---
    const handleScheduleTest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/api/admin/schedule-test`, { title, category, scheduled_time: scheduledTime, duration });
            alert(res.data.message); setTitle(''); setScheduledTime(''); fetchDashboardData(); 
        } catch (err) { alert("Failed to schedule test."); } finally { setLoading(false); }
    };

    const handleDeleteTest = async (id) => {
        if (!window.confirm("Delete this test?")) return;
        try {
            await axios.delete(`${API_BASE}/api/admin/tests/${id}`);
            if(selectedTestForResults?.id === id) setSelectedTestForResults(null);
            fetchDashboardData();
        } catch (err) { alert("Failed to delete test"); }
    };

    const handleViewResults = async (test) => {
        try {
            const res = await axios.get(`${API_BASE}/api/admin/tests/${test.id}/results`);
            setLeaderboard(res.data); setSelectedTestForResults(test);
        } catch (err) { alert("Failed to fetch leaderboard."); }
    };

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Delete ${name}? Cannot be undone.`)) return;
        try {
            await axios.delete(`${API_BASE}/api/admin/users/${id}`);
            fetchDashboardData();
        } catch (err) { alert("Failed to delete user."); }
    };

    const handleViewStudentProfile = async (user) => {
        try {
            const res = await axios.get(`${API_BASE}/api/admin/users/${user.id}/profile`);
            setStudentProfile(res.data); setSelectedStudent(user); setActiveTab('student_profile');
        } catch (err) { alert("Failed to load student profile."); }
    };

    // --- Resource Handlers ---
    const handleAddResource = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', resTitle);
            formData.append('description', resDesc);
            formData.append('category', resCategory);
            formData.append('resource_type', resType);
            
            if (resFile && ['PDF', 'CheatSheet', 'Podcast'].includes(resType)) {
                formData.append('file', resFile);
            } else {
                formData.append('content_url', resUrl);
            }

            await axios.post(`${API_BASE}/api/resources/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            alert("Resource added successfully!");
            setResTitle(''); setResDesc(''); setResUrl(''); setResFile(null);
            fetchDashboardData();
        } catch(err) { 
            alert("Failed to add resource. " + (err.response?.data?.detail || "")); 
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteResource = async (id) => {
        if(!window.confirm("Delete this resource?")) return;
        try {
            await axios.delete(`${API_BASE}/api/resources/${id}`);
            fetchDashboardData();
        } catch(err) { alert("Failed to delete"); }
    };

    const filteredUsers = usersList.filter(u => 
        (u.fname + " " + u.lname).toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getHealthColor = (score) => {
        if (score >= 80) return "text-green-400 bg-green-500/10 border-green-500/30";
        if (score >= 50) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
        return "text-red-400 bg-red-500/10 border-red-500/30";
    };

    const getResourceIcon = (type) => {
        switch(type) {
            case 'PDF': return <FiFileText className="text-red-400" />;
            case 'Video': return <FiYoutube className="text-red-500" />;
            case 'GitHub': return <FiGithub className="text-gray-300" />;
            case 'Podcast': return <FiHeadphones className="text-green-400" />;
            case 'CheatSheet': return <FiImage className="text-purple-400" />;
            default: return <FiGlobe className="text-blue-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex text-white font-sans overflow-hidden">
            
            {/* LEFT COLUMN: Sidebar */}
            <div className="w-64 bg-[#1E293B] border-r border-gray-800 flex flex-col p-6 shrink-0 h-screen sticky top-0 z-40">
                <h1 className="text-2xl font-black text-red-500 mb-10 tracking-widest uppercase">PLACIFY <span className="text-white">ADMIN</span></h1>
                <nav className="flex-1 space-y-2">
                    <button onClick={() => { setActiveTab('tests'); setSelectedTestForResults(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'tests' ? 'bg-red-500/10 text-red-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiCalendar /> Test Dashboard
                    </button>
                    <button onClick={() => { setActiveTab('users'); setSelectedStudent(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'users' || activeTab === 'student_profile' ? 'bg-red-500/10 text-red-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiUsers /> Manage Users
                    </button>
                    <button onClick={() => setActiveTab('resources')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'resources' ? 'bg-red-500/10 text-red-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <FiBookOpen /> Study Resources
                    </button>
                </nav>
                <button onClick={handleLogout} className="flex items-center justify-center gap-2 text-gray-500 hover:text-white mt-auto py-3">
                    <FiLogOut /> Logout
                </button>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar relative">
                <div className="shrink-0 w-full z-30">
                    <Navbar toggleSidebar={() => {}} />
                </div>

                <div className="flex-1 p-6 md:p-10 pt-2">
                    
                    {/* Only show global stats on tests tab */}
                    {activeTab === 'tests' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                            <div className="bg-[#1E293B] p-6 rounded-2xl border border-gray-700">
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Students</p>
                                <p className="text-4xl font-black text-blue-400">{stats.total_users}</p>
                            </div>
                            <div className="bg-[#1E293B] p-6 rounded-2xl border border-gray-700">
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Tests Scheduled</p>
                                <p className="text-4xl font-black text-purple-400">{stats.total_tests}</p>
                            </div>
                        </div>
                    )}

                    {/* TAB: TESTS */}
                    {activeTab === 'tests' && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-bold mb-8">Test Management</h2>
                            <div className="grid xl:grid-cols-2 gap-8">
                                <div className="bg-[#1E293B] border border-gray-700 p-8 rounded-3xl h-fit">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-gray-700 pb-4">
                                        <FiPlus className="text-red-500" /> Schedule New Test
                                    </h3>
                                    
                                    <form onSubmit={handleScheduleTest} className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Test Title</label>
                                            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 focus:border-red-500 outline-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
                                                <select 
                                                    value={category} 
                                                    onChange={e => {
                                                        setCategory(e.target.value);
                                                        if (e.target.value === 'coding') setDuration(75);
                                                        else setDuration(60);
                                                    }} 
                                                    className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 focus:border-red-500 outline-none"
                                                >
                                                    <option value="aptitude">Aptitude</option>
                                                    <option value="technical">Technical</option>
                                                    <option value="coding">Coding Assessment</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Duration (Mins)</label>
                                                <input type="number" required value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 focus:border-red-500 outline-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Scheduled Date & Time</label>
                                            <input type="datetime-local" required value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 focus:border-red-500 outline-none" />
                                        </div>
                                        <button type="submit" disabled={loading} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition-colors">
                                            {loading ? "Initializing..." : "Schedule Test"}
                                        </button>
                                    </form>
                                </div>

                                <div className="bg-[#1E293B] border border-gray-700 p-8 rounded-3xl overflow-y-auto max-h-[700px] custom-scrollbar">
                                    {selectedTestForResults ? (
                                        <div className="animate-fade-in">
                                            <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
                                                <div>
                                                    <button onClick={() => setSelectedTestForResults(null)} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-2">
                                                        <FiArrowLeft /> Back to Tests
                                                    </button>
                                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                                        <FiAward className="text-yellow-400" /> Leaderboard
                                                    </h3>
                                                </div>
                                            </div>
                                            {leaderboard.length > 0 ? (
                                                <div className="space-y-3">
                                                    {leaderboard.map((student, idx) => (
                                                        <div key={idx} className="bg-[#0F172A] p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-gray-500 font-bold text-lg w-6">#{idx + 1}</span>
                                                                <div>
                                                                    <p className="font-bold text-white">{student.user_name}</p>
                                                                    <p className="text-xs text-gray-400">{student.email}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xl font-black text-neon-green">{student.score} <span className="text-sm text-gray-500 font-normal">/ {student.total}</span></p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-10 text-gray-500">No students have completed this test yet.</div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="animate-fade-in">
                                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-gray-700 pb-4">
                                                <FiClock className="text-blue-400" /> Manage Tests
                                            </h3>
                                            <div className="space-y-4">
                                                {tests.map(test => (
                                                    <div key={test.id} className="bg-[#0F172A] p-5 rounded-2xl border border-gray-700 flex justify-between items-center group">
                                                        <div>
                                                            <h4 className="font-bold text-lg">{test.title}</h4>
                                                            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{test.test_category} • {test.duration_minutes} Mins</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => handleViewResults(test)} className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">Leaderboard</button>
                                                            <button onClick={() => handleDeleteTest(test.id)} className="bg-red-500/10 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><FiTrash2 className="text-xl" /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: USERS LIST */}
                    {activeTab === 'users' && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold">Student Database</h2>
                                <div className="relative w-64">
                                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input type="text" placeholder="Search name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#1E293B] border border-gray-700 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-neon-blue" />
                                </div>
                            </div>

                            <div className="bg-[#1E293B] border border-gray-700 rounded-3xl overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-700">
                                            <th className="p-5 font-bold">Student</th>
                                            <th className="p-5 font-bold">Email</th>
                                            <th className="p-5 font-bold">Joined</th>
                                            <th className="p-5 font-bold text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {filteredUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handleViewStudentProfile(u)}>
                                                <td className="p-5 font-bold text-white flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-blue-600 flex items-center justify-center text-xs shadow-lg">{u.fname[0].toUpperCase()}</div>
                                                    {u.fname} {u.lname}
                                                </td>
                                                <td className="p-5 text-gray-300 text-sm">{u.email}</td>
                                                <td className="p-5 text-gray-400 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                                                <td className="p-5 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={(e) => { e.stopPropagation(); handleViewStudentProfile(u); }} className="bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">View 360°</button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(u.id, u.fname); }} className="bg-red-500/10 text-red-500 p-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><FiTrash2 /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB: RESOURCES */}
                    {activeTab === 'resources' && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-bold mb-8">Resource Library Management</h2>
                            <div className="grid xl:grid-cols-3 gap-8">
                                {/* Add Resource Form */}
                                <div className="bg-[#1E293B] border border-gray-700 p-8 rounded-3xl h-fit xl:col-span-1">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-gray-700 pb-4">
                                        <FiPlus className="text-red-500" /> Add New Material
                                    </h3>
                                    <form onSubmit={handleAddResource} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title</label>
                                            <input type="text" required value={resTitle} onChange={e=>setResTitle(e.target.value)} className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-neon-blue outline-none text-white" placeholder="e.g. Top 100 Array Questions" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                                            <textarea required value={resDesc} onChange={e=>setResDesc(e.target.value)} className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-neon-blue outline-none text-white h-20 resize-none" placeholder="Brief description..."></textarea>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
                                                <select value={resCategory} onChange={e=>setResCategory(e.target.value)} className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-neon-blue outline-none text-white">
                                                    <option value="Aptitude">Aptitude</option>
                                                    <option value="Technical">Technical & Coding</option>
                                                    <option value="Interview">Interview & HR</option>
                                                    <option value="General">General Career</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Type</label>
                                                <select value={resType} onChange={e=>setResType(e.target.value)} className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-neon-blue outline-none text-white">
                                                    <option value="PDF">PDF Document</option>
                                                    <option value="Video">YouTube Video</option>
                                                    <option value="GitHub">GitHub Repo</option>
                                                    <option value="Article">Web Roadmap</option>
                                                    <option value="Podcast">Podcast / Audio</option>
                                                    <option value="CheatSheet">Cheat Sheet (Img/PDF)</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        {/* DYNAMIC INPUT: Switch between File Upload and URL based on Type */}
                                        {['PDF', 'CheatSheet', 'Podcast'].includes(resType) ? (
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Upload File</label>
                                                <input 
                                                    type="file" 
                                                    required 
                                                    // 🔥 FIXED: Accept both image/* and .pdf when CheatSheet is selected!
                                                    accept={resType === 'PDF' ? ".pdf" : resType === 'CheatSheet' ? "image/*,.pdf" : "audio/*"}
                                                    onChange={e => setResFile(e.target.files[0])} 
                                                    className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:border-neon-blue outline-none text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-neon-blue file:text-black hover:file:bg-cyan-300 cursor-pointer" 
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">URL Link</label>
                                                <input 
                                                    type="url" 
                                                    required 
                                                    value={resUrl} 
                                                    onChange={e=>setResUrl(e.target.value)} 
                                                    className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-neon-blue outline-none text-white" 
                                                    placeholder="https://..." 
                                                />
                                            </div>
                                        )}

                                        <button type="submit" disabled={loading} className="w-full py-4 bg-neon-blue hover:bg-cyan-300 text-black font-bold rounded-xl shadow-[0_0_15px_rgba(45,212,191,0.3)] transition-colors mt-2 disabled:opacity-50">
                                            {loading ? "Uploading..." : "Upload Resource"}
                                        </button>
                                    </form>
                                </div>

                                {/* Resource List */}
                                <div className="bg-[#1E293B] border border-gray-700 p-8 rounded-3xl xl:col-span-2 overflow-y-auto max-h-[700px] custom-scrollbar">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-gray-700 pb-4">
                                        <FiBookOpen className="text-blue-400" /> Uploaded Materials Database
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {resources.map(res => (
                                            <div key={res.id} className="bg-[#0F172A] p-5 rounded-2xl border border-gray-700 relative group flex flex-col hover:border-gray-500 transition-colors">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-2">
                                                        {getResourceIcon(res.resource_type)}
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{res.resource_type}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-500 uppercase font-bold bg-white/5 px-2 py-0.5 rounded">{res.category}</span>
                                                </div>
                                                <h4 className="font-bold text-white mb-1 line-clamp-1">{res.title}</h4>
                                                <p className="text-xs text-gray-400 line-clamp-2 flex-1 mb-2">{res.description}</p>
                                                
                                                <button onClick={() => handleDeleteResource(res.id)} className="absolute top-4 right-4 bg-red-500/20 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        ))}
                                        {resources.length === 0 && <p className="text-gray-500 italic text-sm col-span-2 text-center py-10 border border-dashed border-gray-700 rounded-xl">No resources uploaded yet.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: STUDENT 360 PROFILE */}
                    {activeTab === 'student_profile' && studentProfile && (
                        <div className="animate-fade-in max-w-6xl mx-auto pb-10">
                            {/* Header */}
                            <button onClick={() => setActiveTab('users')} className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6">
                                <FiArrowLeft /> Back to Student Database
                            </button>
                            
                            <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-neon-purple to-blue-600 flex items-center justify-center text-3xl font-bold shadow-lg border border-white/10">
                                        {studentProfile.user.fname[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-bold">{studentProfile.user.fname} {studentProfile.user.lname}</h2>
                                        <p className="text-gray-400 mt-1 flex items-center gap-2"><FiMail /> {studentProfile.user.email}</p>
                                    </div>
                                </div>
                                
                                {/* Health Score Banner */}
                                <div className={`px-6 py-4 rounded-2xl border ${getHealthColor(studentProfile.health_score)} flex items-center gap-4 shadow-xl`}>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest font-bold opacity-80">System Prediction</p>
                                        <p className="text-2xl font-black">{studentProfile.readiness}</p>
                                    </div>
                                    <div className="text-5xl font-black opacity-30">{studentProfile.health_score}</div>
                                </div>
                            </div>

                            {/* Analytics Grid */}
                            <div className="grid xl:grid-cols-4 gap-6 mb-8">
                                
                                {/* 1. Performance Trend Chart */}
                                <div className="xl:col-span-2 bg-[#1E293B] p-6 rounded-3xl border border-gray-700 shadow-lg">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2"><FiActivity className="text-blue-400" /> Recent Performance Trend</h3>
                                    {studentProfile.test_trend.length > 0 ? (
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={studentProfile.test_trend}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                                    <Tooltip 
                                                        contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                                                        itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                                                        formatter={(value) => [`${value}%`, "Accuracy"]}
                                                    />
                                                    <Line type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={4} dot={{ r: 6, fill: '#0F172A', stroke: '#38bdf8', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-64 flex items-center justify-center text-gray-500 italic border border-dashed border-gray-700 rounded-2xl">Not enough test data</div>
                                    )}
                                </div>

                                {/* 2. Subject Mastery Chart */}
                                <div className="xl:col-span-1 bg-[#1E293B] p-6 rounded-3xl border border-gray-700 shadow-lg">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2"><FiTarget className="text-purple-400" /> Subject Mastery</h3>
                                    {studentProfile.subject_mastery.length > 0 ? (
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={studentProfile.subject_mastery} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                                    <XAxis type="number" domain={[0, 100]} hide />
                                                    <YAxis dataKey="subject" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                                                    <Bar dataKey="accuracy" fill="#a855f7" radius={[0, 8, 8, 0]} barSize={24} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                         <div className="h-64 flex items-center justify-center text-gray-500 italic border border-dashed border-gray-700 rounded-2xl">No subjects attempted</div>
                                    )}
                                </div>

                                {/* 3. AI Insights & Soft Skills */}
                                <div className="xl:col-span-1 flex flex-col gap-6">
                                    <div className="bg-[#0F172A] p-6 rounded-3xl border border-red-500/30 relative overflow-hidden flex-1 flex flex-col justify-center">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                        <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FiAlertTriangle /> AI Risk Detection</h3>
                                        <p className="text-gray-300 text-sm leading-relaxed relative z-10">
                                            {studentProfile.weakest_subject !== "None" 
                                                ? <span>Student is consistently struggling with <strong className="text-white bg-red-500/20 px-2 py-0.5 rounded">{studentProfile.weakest_subject}</strong>. Recommend assigning targeted practice modules before the next major assessment.</span>
                                                : <span>Insufficient data to detect weaknesses. Recommend scheduling a baseline aptitude test.</span>
                                            }
                                        </p>
                                    </div>

                                    <div className="bg-[#1E293B] p-5 rounded-3xl border border-gray-700 flex-1 flex flex-col justify-center">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Soft Skills Progress</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center bg-black/30 p-3 rounded-xl">
                                                <span className="text-sm text-gray-300">Mock Interviews</span>
                                                <span className="font-bold text-neon-blue">{studentProfile.soft_skills.interviews_taken} Taken</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-black/30 p-3 rounded-xl">
                                                <span className="text-sm text-gray-300">Avg Comm. Score</span>
                                                <span className="font-bold text-neon-green">{studentProfile.soft_skills.avg_interview_score} / 100</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Coding Analytics & Test History Row */}
                            <div className="grid lg:grid-cols-3 gap-6 mb-6">
                                {/* Coding Analytics */}
                                <div className="bg-[#1E293B] p-6 rounded-3xl border border-gray-700 h-fit">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><FiCode /> Coding Mastery</h3>
                                    <div className="flex gap-2 h-4 rounded-full overflow-hidden mb-4 bg-gray-800">
                                        <div style={{width: `${(studentProfile.coding.easy/Math.max(1, studentProfile.coding.total))*100}%`}} className="bg-green-500"></div>
                                        <div style={{width: `${(studentProfile.coding.medium/Math.max(1, studentProfile.coding.total))*100}%`}} className="bg-yellow-500"></div>
                                        <div style={{width: `${(studentProfile.coding.hard/Math.max(1, studentProfile.coding.total))*100}%`}} className="bg-red-500"></div>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-green-400">Easy: {studentProfile.coding.easy}</span>
                                        <span className="text-yellow-400">Med: {studentProfile.coding.medium}</span>
                                        <span className="text-red-400">Hard: {studentProfile.coding.hard}</span>
                                    </div>
                                    <p className="text-center text-sm text-gray-500 mt-6 pt-4 border-t border-gray-700">Total Solved: <strong className="text-white text-lg">{studentProfile.coding.total}</strong></p>
                                </div>

                                {/* Test History Table */}
                                <div className="lg:col-span-2 bg-[#1E293B] border border-gray-700 rounded-3xl p-6">
                                    <h3 className="text-xl font-bold mb-6">Detailed Assessment History</h3>
                                    {studentProfile.test_history.length > 0 ? (
                                        <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="sticky top-0 bg-[#1E293B] z-10">
                                                    <tr className="text-gray-400 text-xs uppercase tracking-widest border-b border-gray-700">
                                                        <th className="pb-3 font-bold">Test Name</th>
                                                        <th className="pb-3 font-bold">Category</th>
                                                        <th className="pb-3 font-bold">Score</th>
                                                        <th className="pb-3 font-bold">Date Taken</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-800">
                                                    {studentProfile.test_history.map((t, i) => (
                                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                                            <td className="py-4 font-bold text-sm">{t.title}</td>
                                                            <td className="py-4 text-xs text-gray-400 uppercase">{t.test_category}</td>
                                                            <td className="py-4">
                                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${t.score/Math.max(1, t.total) >= 0.7 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                                    {t.score} / {t.total}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 text-xs text-gray-400">{new Date(t.created_at).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-gray-500 flex flex-col items-center border border-dashed border-gray-700 rounded-2xl">
                                            <FiAlertTriangle className="text-3xl mb-3 text-gray-600" />
                                            <p className="text-sm">This student has not completed any scheduled assessments yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}