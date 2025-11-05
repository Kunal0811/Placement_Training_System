import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { analyzeResumeForRole, analyzeResumeForJD } from "../api";
import ScoreDonutChart from "../components/ScoreDonutChart"; // Using your existing component
import { FiUpload, FiFileText, FiBriefcase, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisType, setAnalysisType] = useState("role"); // 'role' or 'jd'
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setAnalysisResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setError("Please upload a resume file (.pdf or .docx).");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setError("");

    try {
      let response;
      if (analysisType === "role") {
        response = await analyzeResumeForRole(resumeFile, token);
        setAnalysisResult(response.data);
      } else {
        if (!jobDescription.trim()) {
          setError("Please paste a job description.");
          setIsLoading(false);
          return;
        }
        response = await analyzeResumeForJD(resumeFile, jobDescription, token);
        setAnalysisResult(response.data);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "An error occurred during analysis."
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper to render lists
  const renderList = (title, items, isMissing = false) => {
    if (!items || items.length === 0) {
      return (
        <div>
          <h4 className="font-semibold text-gray-200">{title}</h4>
          <p className="text-sm text-gray-500">None found.</p>
        </div>
      );
    }
    return (
      <div>
        <h4 className={`font-semibold ${isMissing ? 'text-red-400' : 'text-green-400'}`}>{title}</h4>
        <ul className="flex flex-wrap gap-2 mt-2">
          {items.map((item, index) => (
            <li 
              key={index} 
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                isMissing 
                ? 'bg-red-900/50 text-red-300 border border-red-700' 
                : 'bg-dark-border text-gray-300'
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  // Helper to render format checks
  const renderFormatCheck = (sections) => {
    if (!sections) return null;
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">Resume Formatting Check</h3>
        <ul className="grid grid-cols-2 gap-2">
          {Object.entries(sections).map(([section, isPresent]) => (
            <li key={section} className="flex items-center text-sm text-gray-300">
              {isPresent ? (
                <FiCheckCircle className="text-green-400 mr-2" />
              ) : (
                <FiAlertTriangle className="text-yellow-400 mr-2" />
              )}
              <span className="capitalize">{section}</span>
              {isPresent ? "" : <span className="text-gray-500 ml-1">(Missing)</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-neon-blue text-glow mb-6">
        Resume Analyzer
      </h1>
      
      {/* Tab Selection */}
      <div className="flex border-b border-dark-border mb-6">
        <button
          onClick={() => { setAnalysisType("role"); setAnalysisResult(null); }}
          className={`py-3 px-6 font-semibold transition-colors duration-200 ${
            analysisType === "role"
              ? "border-b-2 border-neon-blue text-neon-blue"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <FiBriefcase className="inline-block mr-2" />
          Match to Job Role
        </button>
        <button
          onClick={() => { setAnalysisType("jd"); setAnalysisResult(null); }}
          className={`py-3 px-6 font-semibold transition-colors duration-200 ${
            analysisType === "jd"
              ? "border-b-2 border-neon-blue text-neon-blue"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <FiFileText className="inline-block mr-2" />
          Match to Job Description
        </button>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="bg-dark-card shadow-lg rounded-lg p-6 md:p-8 border border-dark-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div>
            <label htmlFor="resumeUpload" className="block text-sm font-medium text-gray-400 mb-2">
              Upload Resume (PDF, DOCX)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-border border-dashed rounded-lg cursor-pointer bg-dark-bg hover:bg-opacity-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-10 h-10 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold text-neon-blue">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF or DOCX</p>
                </div>
                <input id="resumeUpload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
              </label>
            </div>
            {resumeFile && <p className="text-sm text-green-400 mt-2">File selected: {resumeFile.name}</p>}

            {analysisType === "jd" && (
              <div className="mt-6">
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-400 mb-2">
                  Paste Job Description
                </label>
                <textarea
                  id="jobDescription"
                  rows="8"
                  className="w-full p-3 border border-dark-border rounded-lg focus:ring-neon-blue focus:border-neon-blue bg-dark-bg text-gray-200"
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>
            )}
          </div>

          {/* Right Column: Button & Helper Text */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-200">
                {analysisType === "role" ? "How it works" : "What this does"}
              </h3>
              <p className="text-sm text-gray-400 mt-2">
                {analysisType === "role"
                  ? "Upload your resume and we'll scan it for skills. Then, we'll compare those skills against our entire job role database (from dataset.csv) to find the role that's your best fit."
                  : "Upload your resume and paste a job description. We'll extract skills from both and give you a match score, highlighting what skills you have and what you're missing for this specific job."}
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-neon-blue text-black font-semibold rounded-lg shadow hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-opacity-50 disabled:bg-gray-600 disabled:text-gray-400"
            >
              {isLoading ? "Analyzing..." : "Analyze Now"}
            </button>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
      </form>

      {/* Results Area */}
      {isLoading && <div className="text-center my-8"><p className="text-gray-300">Analyzing your resume, please wait...</p></div>}

      {analysisResult && (
        <div className="mt-10 bg-dark-card shadow-lg rounded-lg p-6 md:p-8 border border-dark-border">
          <h2 className="text-2xl font-bold text-gray-200 mb-6">Analysis Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1: Score & Role */}
            <div className="flex flex-col items-center justify-center p-4 bg-dark-bg rounded-lg border border-dark-border">
              {analysisType === 'role' && (
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Best Matched Role</h3>
              )}
              {analysisType === 'jd' && (
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Job Description Match</h3>
              )}
              
              <ScoreDonutChart 
                score={analysisResult.best_match?.score || analysisResult.jd_match?.score || 0}
              />

              {analysisType === 'role' && (
                <span className="text-xl font-bold text-neon-blue mt-2 text-glow">
                  {analysisResult.best_match?.role}
                </span>
              )}
            </div>

            {/* Column 2: Skills Analysis */}
            <div className="space-y-6">
              {renderList(
                "Skills to Improve (Missing)",
                analysisResult.best_match?.missing_skills || analysisResult.jd_match?.missing_skills,
                true // isMissing = true
              )}
              {renderList(
                "Your Matching Skills",
                analysisResult.best_match?.matching_skills || analysisResult.jd_match?.matching_skills
              )}
            </div>
            
            {/* Column 3: Format Check */}
            <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
              {renderFormatCheck(analysisResult.format_analysis)}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;