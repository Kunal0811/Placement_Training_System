// src/pages/ResumeAnalyzer.jsx
import React, { useState } from 'react';
import axios from 'axios';
import API_BASE from '../api';
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts';

// Star rating component
const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
      ))}
    </div>
  );
};


export default function ResumeAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescription || !jobRole || !resumeFile) {
      setError("Please fill in all fields and upload your resume.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResults(null);

    const formData = new FormData();
    formData.append('job_description', jobDescription);
    formData.append('job_role', jobRole);
    formData.append('resume_file', resumeFile);

    try {
      const res = await axios.post(`${API_BASE}/api/resume/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const scoreData = results ? [
    { subject: 'Overall Match', value: results.overall_score, fullMark: 100 },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-3 text-glow bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">
          📄 AI Resume Analyzer
        </h1>
        <p className="text-lg text-gray-400">
          Get an expert analysis of your resume's match against a job description.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* --- Input Form --- */}
        <div className="bg-dark-card p-8 rounded-xl shadow-lg border border-neon-blue/20 self-start">
          <h2 className="text-2xl font-semibold mb-6 text-white">Enter Job Details</h2>
          {error && <p className="bg-red-500/20 text-red-400 border border-red-500/50 p-3 rounded-lg mb-6 text-center font-semibold">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium text-gray-400">Job Role</label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g., Software Engineer"
                className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-400">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows="10"
                placeholder="Paste the full job description here..."
                className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-400">Upload Resume (.pdf or .docx)</label>
              <label htmlFor="resume-upload" className="w-full cursor-pointer bg-dark-bg border border-gray-600 rounded-lg px-4 py-3 text-gray-400 flex items-center justify-between hover:border-neon-blue">
                <span>{fileName || "Click to upload file..."}</span>
                <span className="bg-neon-blue text-black font-bold py-1 px-3 rounded-lg text-sm">
                  Browse
                </span>
              </label>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neon-blue text-black font-bold py-3 rounded-lg hover:scale-105 transition-transform animate-glow disabled:bg-gray-600 disabled:animate-none"
            >
              {isLoading ? "Analyzing..." : "Analyze My Resume"}
            </button>
          </form>
        </div>

        {/* --- Results Display --- */}
        <div className="bg-dark-card p-8 rounded-xl shadow-lg border border-neon-blue/20">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Analysis Report</h2>
          {isLoading && (
            <div className="text-center py-20">
              <div className="text-4xl mb-4 animate-spin">⚙️</div>
              <p className="text-lg text-gray-400">Running AI analysis... This may take a moment.</p>
            </div>
          )}
          {results && (
            <div className="space-y-8">
              {/* Overall Score & Summary */}
              <div>
                <h3 className="text-2xl font-semibold text-neon-blue text-center mb-2">Overall Match Score: {results.overall_score}%</h3>
                
                <p className="text-gray-300 text italic">{results.overall_summary}</p>
              </div>

              {/* Skill Match Breakdown */}
              {results.skill_match_breakdown && (
                <div>
                  <h3 className="text-xl font-semibold text-neon-blue mb-3">🧠 Skill Match Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-neon-blue/30">
                          <th className="p-2 text-white">Skill Area</th>
                          <th className="p-2 text-white">Job Requirement</th>
                          <th className="p-2 text-white">Your Resume</th>
                          <th className="p-2 text-white">Match</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        {results.skill_match_breakdown.map((skill, i) => (
                          <tr key={i} className="border-b border-gray-800">
                            <td className="p-2 font-semibold">{skill.skill_area}</td>
                            <td className="p-2 text-sm">{skill.job_requirement}</td>
                            <td className="p-2 text-sm" dangerouslySetInnerHTML={{ __html: skill.resume_mention.replace(/✅/g, '<span class="text-neon-green">✅</span>').replace(/❌/g, '<span class="text-red-500">❌</span>') }}></td>
                            <td className="p-2"><StarRating rating={skill.match_rating} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Project Relevance */}
              {results.project_relevance && (
                 <div>
                  <h3 className="text-xl font-semibold text-neon-blue mb-3">💼 Project Relevance</h3>
                  <p className="text-gray-300 mb-2">{results.project_relevance.summary}</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-400 text-sm">
                    {results.project_relevance.tips.map((tip, i) => <li key={i}>💡 {tip}</li>)}
                  </ul>
                </div>
              )}

              {/* Education Analysis */}
              {results.education_analysis && (
                 <div>
                  <h3 className="text-xl font-semibold text-neon-blue mb-3">🎓 Education & Certifications</h3>
                  <p className="text-gray-300 mb-2">{results.education_analysis.summary}</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-400 text-sm">
                    {results.education_analysis.tips.map((tip, i) => <li key={i}>💡 {tip}</li>)}
                  </ul>
                </div>
              )}

              {/* Recommended Improvements */}
              {results.recommended_improvements && (
                 <div>
                  <h3 className="text-xl font-semibold text-neon-blue mb-3">🧩 Recommended Improvements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    {results.recommended_improvements.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </div>
              )}

            </div>
          )}
          {!isLoading && !results && (
            <p className="text-gray-500 text-center py-20">Your expert analysis report will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}