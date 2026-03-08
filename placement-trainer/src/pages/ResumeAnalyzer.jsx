import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { analyzeResumeForRole, analyzeResumeForJD } from "../api";
import ScoreDonutChart from "../components/ScoreDonutChart";
import { 
  FiUpload, FiFileText, FiBriefcase, FiAlertTriangle, 
  FiCheckCircle, FiStar, FiSearch, FiInfo, FiZap 
} from "react-icons/fi";

// --- Star Rating Component (Updated for Light Theme) ---
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return (
    <div className="flex text-amber-400" style={{ minWidth: '100px' }}>
      {[...Array(fullStars)].map((_, i) => <FiStar key={`f-${i}`} fill="currentColor" />)}
      {halfStar && <FiStar key="h" fill="currentColor" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)' }} />}
      {[...Array(emptyStars)].map((_, i) => <FiStar key={`e-${i}`} />)}
    </div>
  );
};

// --- Job Roles List ---
const jobRoles = [
  "Data Analyst", "Data Scientist", "Machine Learning Engineer", "AI Engineer",
  "Software Engineer","Python Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "DevOps Engineer", "Cloud Engineer", "Cybersecurity Analyst", "Database Administrator",
  "UI/UX Designer", "Mobile App Developer", "Game Developer", "Embedded Systems Engineer",
  "IoT Engineer", "Network Engineer", "System Administrator", "Data Engineer",
  "Business Analyst", "Project Manager", "QA Engineer", "Product Manager",
  "Content Writer", "Digital Marketing Specialist", "Graphic Designer", "Blockchain Developer",
  "Game Designer", "Mechanical Engineer", "Electrical Engineer", "Civil Engineer",
  "AI Prompt Engineer", "AR/VR Developer", "Research Scientist (AI)", "Operations Manager",
  "HR Manager", "Financial Analyst", "Customer Support Executive", "Marketing Manager",
  "Technical Writer", "Automation Engineer", "Robotics Engineer", "Data Architect"
];

const ResumeSuggestions = ({ formatAnalysis, analysisData }) => {
  const suggestions = [];
  if (formatAnalysis) {
    if (!formatAnalysis.projects) suggestions.push({ type: 'format', title: 'Missing Projects', text: "Your resume lacks a **Projects** section. Add 2-3 technical projects." });
    if (!formatAnalysis.experience) suggestions.push({ type: 'format', title: 'Missing Experience', text: "Add an **Experience** section to showcase professional or internship history." });
  }

  if (analysisData && analysisData.breakdown) {
    const lowScoringAreas = analysisData.breakdown
      .filter(item => item.match_rating < 3 && item.missing_skills.length > 0)
      .slice(0, 2);
    
    for (const area of lowScoringAreas) {
      suggestions.push({ type: 'skill', title: `Skill Gap: ${area.skill_area}`, text: `Add keywords like: **${area.missing_skills.join(', ')}**.` });
    }
  }

  return (
    <div className="space-y-4">
      {suggestions.length === 0 ? (
        <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
          <FiCheckCircle className="text-emerald-500 mt-1" size={20} />
          <p className="text-emerald-700 text-sm font-medium">Your resume structure is excellent for this role!</p>
        </div>
      ) : (
        suggestions.map((sug, i) => (
          <div key={i} className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 transition-transform hover:scale-[1.01]">
            <FiAlertTriangle className="text-amber-500 mt-1" size={20} />
            <div>
              <h4 className="text-amber-800 font-bold text-sm mb-1">{sug.title}</h4>
              <p className="text-amber-700 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: sug.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisType, setAnalysisType] = useState("role");
  const [jobRole, setJobRole] = useState(jobRoles[0]); 
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setAnalysisResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) { setError("Please upload a resume file."); return; }
    setIsLoading(true);
    setError("");

    try {
      let response = analysisType === "role" 
        ? await analyzeResumeForRole(resumeFile, token)
        : await analyzeResumeForJD(resumeFile, jobDescription, jobRole, token);
      setAnalysisResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Analysis failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const analysisData = analysisType === 'role' ? analysisResult?.best_match_details : analysisResult?.jd_match_details;

  return (
    <div 
      className="min-h-screen bg-fixed bg-cover bg-center font-sans text-slate-900 relative pb-20"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2000&auto=format&fit=crop")' }}
    >
      <div className="absolute inset-0 bg-sky-50/90 backdrop-blur-sm -z-10"></div>

      <div className="container mx-auto p-6 md:p-12 max-w-6xl relative z-10">
        <header className="mb-10 border-b border-gray-200/60 pb-8">
          <h1 className="text-5xl font-display font-extrabold text-slate-800 mb-2 tracking-tight flex items-center gap-4">
            RESUME <span className="text-blue-600">ANALYZER</span>
          </h1>
          <p className="text-slate-500 font-medium">Optimize your resume for Applicant Tracking Systems (ATS) with AI.</p>
        </header>

        {/* Tab Selection */}
        <div className="flex bg-white/60 p-1.5 rounded-2xl border border-white shadow-sm mb-10 w-fit">
          <button
            onClick={() => { setAnalysisType("role"); setAnalysisResult(null); }}
            className={`py-3 px-8 rounded-xl font-bold text-sm transition-all ${analysisType === "role" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-800"}`}
          >
            <FiBriefcase className="inline-block mr-2" /> Match to Role
          </button>
          <button
            onClick={() => { setAnalysisType("jd"); setAnalysisResult(null); }}
            className={`py-3 px-8 rounded-xl font-bold text-sm transition-all ${analysisType === "jd" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-800"}`}
          >
            <FiFileText className="inline-block mr-2" /> Match to JD
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="space-y-8">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Upload Document</label>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-blue-200 border-dashed rounded-[2rem] cursor-pointer bg-blue-50/30 hover:bg-blue-50 transition-all group">
                <FiUpload className="w-10 h-10 text-blue-400 group-hover:-translate-y-1 transition-transform" />
                <p className="mt-3 text-sm text-slate-600 font-semibold">{resumeFile ? resumeFile.name : "Select Resume (PDF/DOCX)"}</p>
                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
              </label>
            </div>

            {analysisType === "jd" && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Target Role</label>
                  <select
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 outline-none font-semibold text-slate-700"
                  >
                    {jobRoles.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Job Description</label>
                  <textarea
                    rows="6"
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-200 outline-none text-sm text-slate-700 leading-relaxed"
                    placeholder="Paste the full job requirements here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between p-8 bg-blue-600 rounded-[2rem] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div>
              <FiInfo className="mb-4 opacity-80" size={28} />
              <h3 className="text-2xl font-bold mb-4">Smart Scan</h3>
              <p className="text-blue-50 text-sm leading-relaxed mb-8">
                {analysisType === "role" 
                  ? "Our AI scans your skills and matches them against thousands of industry standard benchmarks to find your ideal career fit."
                  : "Compare your resume directly against a specific job post. We'll identify exactly which keywords and experiences you're missing."}
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-white text-blue-600 font-extrabold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:bg-blue-200"
            >
              {isLoading ? "ANALYZING..." : "ANALYZE NOW"}
            </button>
          </div>
        </form>

        {/* Results Area */}
        {analysisResult && (
          <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-xl flex flex-col items-center justify-center text-center">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Match Score</h3>
                <ScoreDonutChart score={analysisData?.overall_score || 0} />
                <span className="text-2xl font-black text-blue-600 mt-6">{analysisData?.role || "Result"}</span>
              </div>

              <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-xl">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <FiCheckCircle className="text-blue-500" /> Structure Check
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(analysisResult.format_analysis).map(([section, isPresent]) => (
                    <div key={section} className={`p-4 rounded-2xl border flex items-center gap-3 ${isPresent ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                      {isPresent ? <FiCheckCircle className="text-emerald-500" /> : <FiAlertTriangle className="text-slate-400" />}
                      <span className="text-xs font-bold text-slate-700 capitalize">{section}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-white">
                  <FiZap className="text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-800">Skill Match Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-tighter text-slate-400 border-b border-gray-50">
                        <th className="p-5">Area</th>
                        <th className="p-5">Match Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {analysisData?.breakdown.map((item, index) => (
                        <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                          <td className="p-5">
                            <p className="font-bold text-slate-800 text-sm">{item.skill_area}</p>
                            <p className="text-[10px] text-slate-500 mt-1 max-w-xs">{item.job_requirement}</p>
                          </td>
                          <td className="p-5"><StarRating rating={item.match_rating} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FiTrendingUp className="text-blue-600" /> Roadmap to 100%
                </h3>
                <ResumeSuggestions 
                  formatAnalysis={analysisResult.format_analysis} 
                  analysisData={analysisData}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;