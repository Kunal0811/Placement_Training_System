import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { analyzeResumeForRole, analyzeResumeForJD } from "../api";
import ScoreDonutChart from "../components/ScoreDonutChart";
import { FiUpload, FiFileText, FiBriefcase, FiAlertTriangle, FiCheckCircle, FiStar } from "react-icons/fi";

// --- Star Rating Component ---
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return (
    <div className="flex text-yellow-400" style={{ minWidth: '100px' }}>
      {[...Array(fullStars)].map((_, i) => <FiStar key={`f-${i}`} fill="currentColor" />)}
      {halfStar && <FiStar key="h" fill="currentColor" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)' }} />}
      {[...Array(emptyStars)].map((_, i) => <FiStar key={`e-${i}`} />)}
    </div>
  );
};

// --- List of roles from your JSON file ---
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


// --- NEW SUGGESTIONS COMPONENT ---
const ResumeSuggestions = ({ formatAnalysis, analysisData }) => {
  const suggestions = [];

  // 1. Check for missing sections
  if (formatAnalysis) {
    if (!formatAnalysis.projects) {
      suggestions.push({
        type: 'format',
        title: 'Missing Projects Section',
        text: "Your resume doesn't seem to have a dedicated **Projects** section. This is critical for showing your hands-on skills. Add 2-3 relevant projects."
      });
    }
    if (!formatAnalysis.experience) {
      suggestions.push({
        type: 'format',
        title: 'Missing Experience Section',
        text: "Consider adding an **Experience** or **Internship** section. If you don't have one, this is okay, but it's a major plus for recruiters."
      });
    }
    if (!formatAnalysis.achievements) {
      suggestions.push({
        type: 'format',
        title: 'Missing Achievements Section',
        text: "An **Achievements** or **Awards** section can help you stand out. Consider adding hackathon wins, high ranks, or scholarships."
      });
    }
  }

  // 2. Check for missing skills in low-scoring areas
  if (analysisData && analysisData.breakdown) {
    const lowScoringAreas = analysisData.breakdown
      .filter(item => item.match_rating < 3 && item.missing_skills.length > 0) // < 3 stars and has missing skills
      .slice(0, 3); // Get top 3
    
    for (const area of lowScoringAreas) {
      suggestions.push({
        type: 'skill',
        title: `Improve Your ${area.skill_area} Skills`,
        text: `To better match this role, try adding keywords or projects related to: **${area.missing_skills.join(', ')}**.`
      });
    }
  }

  if (suggestions.length === 0) {
    return (
      <div className="p-4 bg-green-900/50 border border-green-700 rounded-lg">
        <h3 className="text-lg font-semibold text-neon-green mb-2">
          <FiCheckCircle className="inline-block mr-2" /> Great Work!
        </h3>
        <p className="text-gray-300">Your resume seems well-structured and covers the key skills for this role. You can always improve by adding more specific project details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((sug, i) => (
        <div key={i} className="p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">
            <FiAlertTriangle className="inline-block mr-2" /> {sug.title}
          </h3>
          {/* This renders the **bold** text */}
          <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: sug.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        </div>
      ))}
    </div>
  );
};
// --- END OF NEW COMPONENT ---


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
      } else {
        if (!jobDescription.trim()) {
          setError("Please paste a job description.");
          setIsLoading(false);
          return;
        }
        response = await analyzeResumeForJD(resumeFile, jobDescription, jobRole, token);
      }
      setAnalysisResult(response.data);
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

  // Renders the skill breakdown table
  const renderAnalysisTable = (breakdown) => {
    if (!breakdown || breakdown.length === 0) {
      if (analysisType === 'jd' && jobDescription.trim() === "") {
         return <p className="text-gray-400">Paste a Job Description to see the breakdown.</p>;
      }
      return <p className="text-gray-400">No matching skill categories found for this role/JD combination.</p>;
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="p-3 text-white w-1/4">Skill Area</th>
              <th className="p-3 text-white w-1/3">Job Requirement</th>
              <th className="p-3 text-white w-1/3">Your Resume</th>
              <th className="p-3 text-white w-auto">Match</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {breakdown.map((item, index) => (
              <tr key={index} className="border-b border-gray-800 hover:bg-dark-bg">
                <td className="p-3 font-semibold">{item.skill_area}</td>
                <td className="p-3 text-sm">{item.job_requirement}</td>
                <td className="p-3 text-sm">{item.your_resume}</td>
                <td className="p-3"><StarRating rating={item.match_rating} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Helper variables to get the correct data object
  const analysisData = analysisType === 'role' 
    ? analysisResult?.best_match_details 
    : analysisResult?.jd_match_details;

  const score = analysisData?.overall_score || 0;
  const breakdown = analysisData?.breakdown;
  const roleTitle = analysisData?.role;

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
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="jobRoleSelect" className="block text-sm font-medium text-gray-400 mb-2">
                    Select Target Job Role
                  </label>
                  <select
                    id="jobRoleSelect"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full p-3 border border-dark-border rounded-lg focus:ring-neon-blue focus:border-neon-blue bg-dark-bg text-gray-200"
                  >
                    {jobRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
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
                  ? "Upload your resume and we'll scan it for skills. Then, we'll compare those skills against our job role database to find the role that's your best fit and show a detailed breakdown."
                  : "Upload your resume, select the target role, and paste a job description. We'll extract skills from the JD and show you how your resume matches against the *specific categories* for that role."}
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center justify-center p-4 bg-dark-bg rounded-lg border border-dark-border">
              <h3 className="text-lg font-semibold text-gray-200 mb-2 text-center">
                {analysisType === "role" ? "Best Matched Role" : "Job Description Match"}
              </h3>
              
              <ScoreDonutChart score={score} />

              <span className="text-xl font-bold text-neon-blue mt-2 text-glow text-center">
                {roleTitle}
              </span>
            </div>
            
            <div className="p-4 bg-dark-bg rounded-lg border border-dark-border md:col-span-2">
              {renderFormatCheck(analysisResult.format_analysis)}
            </div>
          </div>
          
          {/* --- MODIFIED: This section now holds the new 2-column layout --- */}
          <div className="grid grid-cols-1 gap-8">
            
            {/* Column 1: Skill Match Breakdown */}
            <div>
              <h3 className="text-xl font-bold text-gray-200 mb-4">Skill Match Breakdown</h3>
              {renderAnalysisTable(breakdown)}
            </div>
            
            {/* Column 2: Recommended Improvements */}
            <div>
              <h3 className="text-xl font-bold text-gray-200 mb-4">Recommended Improvements</h3>
              <ResumeSuggestions 
                formatAnalysis={analysisResult.format_analysis} 
                analysisData={analysisData}
              />
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;