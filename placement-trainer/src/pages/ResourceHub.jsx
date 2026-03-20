import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../api';
import { FiFileText, FiYoutube, FiGithub, FiGlobe, FiHeadphones, FiExternalLink, FiSearch, FiFilter, FiImage } from 'react-icons/fi';

export default function ResourceHub() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/resources/`);
                setResources(res.data);
            } catch (err) {
                console.error("Failed to fetch resources.");
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    // 🔥 NEW: Fix URLs so locally hosted files point to the backend server!
    const getResourceLink = (url) => {
        if (!url) return "#";
        if (url.startsWith('/static')) {
            return `${API_BASE}${url}`;
        }
        return url;
    };

    const getIconForType = (type) => {
        switch(type) {
            case 'PDF': return <FiFileText className="text-red-400" />;
            case 'Video': return <FiYoutube className="text-red-600" />;
            case 'GitHub': return <FiGithub className="text-gray-300" />;
            case 'Podcast': return <FiHeadphones className="text-green-400" />;
            case 'CheatSheet': return <FiImage className="text-purple-400" />;
            default: return <FiGlobe className="text-blue-400" />;
        }
    };

    const getBgColorForType = (type) => {
        switch(type) {
            case 'PDF': return "bg-red-500/10 border-red-500/20";
            case 'Video': return "bg-red-600/10 border-red-600/20";
            case 'GitHub': return "bg-gray-800/50 border-gray-600/50";
            case 'Podcast': return "bg-green-500/10 border-green-500/20";
            case 'CheatSheet': return "bg-purple-500/10 border-purple-500/20";
            default: return "bg-blue-500/10 border-blue-500/20";
        }
    };

    const filteredResources = resources.filter(res => {
        const matchesCategory = activeFilter === 'All' || res.category === activeFilter;
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || res.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">Loading Study Materials...</div>;

    return (
        <div className="min-h-screen p-6 md:p-10 text-white font-sans bg-[#0F172A]">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-black font-display mb-4">Study <span className="text-neon-blue">Resource Hub</span></h1>
                    <p className="text-gray-400 max-w-2xl text-lg">Curated PDFs, video masterclasses, roadmaps, and repositories added by the admin to accelerate your placement prep.</p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-10">
                    <div className="flex flex-wrap gap-2">
                        {['All', 'Aptitude', 'Technical', 'Interview', 'General'].map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => setActiveFilter(cat)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeFilter === cat ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(45,212,191,0.3)] scale-105' : 'bg-[#1E293B] border border-gray-700 text-gray-400 hover:bg-gray-800'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-80">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Search materials..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#1E293B] border border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-neon-blue text-sm transition-colors"
                        />
                    </div>
                </div>

                {/* Resource Grid */}
                {filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResources.map(res => (
                            <div key={res.id} className="bg-[#1E293B] border border-gray-800 rounded-3xl p-6 flex flex-col hover:border-gray-600 transition-all hover:-translate-y-1 shadow-lg hover:shadow-2xl group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3.5 rounded-2xl border ${getBgColorForType(res.resource_type)} text-2xl shadow-inner group-hover:scale-110 transition-transform`}>
                                        {getIconForType(res.resource_type)}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-black/50 px-3 py-1 rounded-full border border-gray-700">{res.category}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 leading-snug">{res.title}</h3>
                                <p className="text-sm text-gray-400 mb-8 flex-1 line-clamp-3 leading-relaxed">{res.description}</p>
                                
                                <a 
                                    href={getResourceLink(res.content_url)} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${res.resource_type === 'Video' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/5'}`}
                                >
                                    {res.resource_type === 'PDF' || res.resource_type === 'CheatSheet' ? 'Download Material' : 'Access Material'} <FiExternalLink />
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-gray-700 rounded-3xl bg-[#1E293B]/50">
                        <FiFilter className="text-5xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-300">No resources found</h3>
                        <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
}