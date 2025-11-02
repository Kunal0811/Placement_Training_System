import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { githubDark } from '@uiw/codemirror-theme-github';
import API_BASE from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const boilerplate = {
  python: `import sys\n\ndef solve():\n    # Your solution logic here.\n\n# Main execution block\nif __name__ == "__main__":\n    solve()\n`,
  java: `import java.io.BufferedReader;\nimport java.io.InputStreamReader;\nimport java.io.IOException;\n\npublic class MyClass {\n    public static void main(String[] args) {\n        // Your solution logic here.\n    }\n}`,
  cpp: `#include <iostream>\n#include <string>\n#include <vector>\n\nint main() {\n    // Your solution logic here.\n}`,
};

export default function CodingPlatform() {
  const { difficulty } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problemList, setProblemList] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState({});
  const [output, setOutput] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [codes, setCodes] = useState({});
  const [language, setLanguage] = useState('python');

  const languageExtensions = { python: [python()], java: [java()], cpp: [cpp()] };
  const currentProblem = problemList[currentProblemIndex];
  const currentCode = currentProblem ? codes[currentProblem.title] || boilerplate[language] : boilerplate[language];
  const currentEvaluation = currentProblem ? evaluationResults[currentProblem.title] : null;

  const fetchLevelProblems = async () => {
    if (!user) return;
    setIsLoading(true);
    setProblemList([]);
    setEvaluationResults({});
    setCurrentProblemIndex(0);
    setCodes({});
    try {
      const res = await fetch(`${API_BASE}/api/coding/generate-level-problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, user_id: user.id, count: 5 }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to fetch problems');
      }
      const data = await res.json();
      setProblemList(data.problems || []);
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(user) fetchLevelProblems();
  }, [difficulty, user]);

  useEffect(() => {
    if (currentProblem?.examples?.[0]?.input) {
      setCustomInput(currentProblem.examples[0].input);
    }
    setOutput('');
  }, [currentProblem]);

  const handleCodeChange = (value) => {
    if (!currentProblem) return;
    setCodes(prev => ({ ...prev, [currentProblem.title]: value }));
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("");
    try {
      const res = await fetch(`${API_BASE}/api/coding/run-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: currentCode, language, input: customInput }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to run code');
      }
      const data = await res.json();
      setOutput(data.output || "Execution finished with no output.");
    } catch (err) {
      console.error(err);
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleEvaluateCode = async () => {
    if (!currentProblem || !user) return;
    setIsEvaluating(true);
    try {
      const res = await fetch(`${API_BASE}/api/coding/evaluate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, problem: currentProblem, code: currentCode, language, difficulty }),
      });
      if (!res.ok) throw new Error('Failed to evaluate code');
      const data = await res.json();
      setEvaluationResults(prev => ({ ...prev, [currentProblem.title]: data }));
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < problemList.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    } else {
      navigate('/technical/coding-levels');
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
            <div className="text-6xl mb-4 animate-spin">⚙️</div>
            <p className="text-2xl font-semibold text-neon-blue">Generating 5 new problems for you...</p>
            <p className="text-gray-400">This may take a moment.</p>
            </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-4 bg-dark-bg min-h-screen">
      {/* Problem List Sidebar */}
      <div className="w-1/4 bg-dark-card p-4 rounded-xl shadow-lg border border-neon-blue/20 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 border-b border-neon-blue/20 pb-3 text-white">Problems</h2>
        <ul className="space-y-2 flex-grow">
          {problemList.map((prob, index) => (
            <li key={prob.title}>
              <button
                onClick={() => setCurrentProblemIndex(index)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                  index === currentProblemIndex ? 'bg-neon-blue text-black font-bold shadow-lg animate-glow' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <span>Problem {index + 1}</span>
                {evaluationResults[prob.title]?.is_correct && <span className="text-green-400">✅</span>}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => navigate('/technical/coding-levels')} className="mt-4 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
            &larr; Back to Levels
        </button>
      </div>

      {/* Main Content Area */}
      <div className="w-3/4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 flex-grow" style={{ minHeight: 0 }}>
          {/* Problem Description */}
          <div className="w-full lg:w-1/2 bg-dark-card p-6 rounded-xl shadow-lg border border-neon-blue/20 overflow-y-auto">
            {currentProblem && (
              <div>
                <h1 className="text-2xl font-bold mb-4 text-white">{currentProblem.title}</h1>
                <p className="text-gray-300 mb-4 whitespace-pre-wrap">{currentProblem.description}</p>
                <h3 className="font-semibold text-neon-blue">Input Format:</h3>
                <p className="text-gray-400 mb-3">{currentProblem.input_format}</p>
                <h3 className="font-semibold text-neon-blue">Output Format:</h3>
                <p className="text-gray-400 mb-4">{currentProblem.output_format}</p>
                {currentProblem.constraints && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-neon-blue">Constraints:</h3>
                    <ul className="list-disc pl-5 text-gray-400">
                      {currentProblem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                )}
                {currentProblem.examples?.map((ex, i) => (
                  <div key={i} className="mt-4">
                    <h3 className="font-semibold text-neon-blue">Example {i + 1}:</h3>
                    <pre className="bg-dark-bg p-3 rounded mt-1 text-sm whitespace-pre-wrap font-mono border border-gray-700">
                      <code className="text-gray-300">
                        <strong>Input:</strong> {ex.input}<br />
                        <strong>Output:</strong> {ex.output}
                        {ex.explanation && <><br/><strong>Explanation:</strong> {ex.explanation}</>}
                      </code>
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editor and Output */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-white">Code Editor</h2>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-2 bg-dark-card border border-neon-blue/30 rounded-md shadow-sm text-white focus:outline-none focus:border-neon-blue">
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <div className="flex-grow border rounded-lg overflow-hidden shadow-md border-neon-blue/20" style={{ minHeight: '300px' }}>
              <CodeMirror value={currentCode} height="100%" extensions={languageExtensions[language]} onChange={handleCodeChange} theme={githubDark} style={{ fontSize: '16px' }} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 h-40">
              <div className="w-full sm:w-1/2 flex flex-col">
                <h3 className="font-semibold mb-1 text-white">Custom Input</h3>
                <textarea value={customInput} onChange={(e) => setCustomInput(e.target.value)} className="w-full flex-grow bg-dark-bg border border-gray-600 rounded-md p-2 font-mono text-sm text-white focus:outline-none focus:border-neon-blue" placeholder="Enter input..."/>
              </div>
              <div className="w-full sm:w-1/2 flex flex-col">
                <h3 className="font-semibold mb-1 text-white">Output</h3>
                <pre className="w-full flex-grow border border-gray-600 rounded-md p-2 font-mono text-sm bg-dark-bg text-white overflow-auto">
                  {isRunning ? "Running..." : output}
                </pre>
              </div>
            </div>
            <div className="mt-2 flex gap-4">
              <button onClick={handleRunCode} disabled={isRunning || isEvaluating} className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed">
                {isRunning ? 'Running...' : '▶️ Run Code'}
              </button>
              <button onClick={handleEvaluateCode} disabled={isEvaluating || isRunning} className="w-1/2 bg-neon-green text-black font-bold py-2 rounded-lg hover:scale-105 transition-transform animate-glow disabled:bg-gray-600 disabled:animate-none">
                {isEvaluating ? 'Evaluating...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Evaluation Result */}
        {(isEvaluating || currentEvaluation) && (
          <div className="p-6 bg-dark-card rounded-xl shadow-lg border border-neon-blue/20 mt-4">
            <h2 className="text-2xl font-bold mb-2 text-white">Evaluation Result</h2>
            {isEvaluating && <p className="text-gray-400">The AI is analyzing your code. Please wait...</p>}
            {currentEvaluation && (
              <div>
                <div className={`p-4 rounded-lg ${currentEvaluation.is_correct ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'} border-l-4`}>
                  <h3 className={`text-lg font-bold ${currentEvaluation.is_correct ? 'text-neon-green' : 'text-red-400'}`}>
                    {currentEvaluation.is_correct ? '✅ Correct Solution' : '❌ Needs Improvement'}
                  </h3>
                  <ul className="mt-2 text-gray-300 list-disc pl-5 space-y-1">
                    {currentEvaluation.feedback_points?.map((point, index) => <li key={index}>{point}</li>)}
                  </ul>
                  <div className="mt-4 flex items-center gap-6 text-sm">
                    <p className="font-medium text-gray-300">Time:<code className={`ml-2 px-2 py-1 rounded-md ${currentEvaluation.is_correct ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-400'}`}>{currentEvaluation.time_complexity}</code></p>
                    <p className="font-medium text-gray-300">Space:<code className={`ml-2 px-2 py-1 rounded-md ${currentEvaluation.is_correct ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-400'}`}>{currentEvaluation.space_complexity}</code></p>
                  </div>
                </div>
                {currentEvaluation.is_correct && (
                  <div className="mt-4">
                    <button onClick={handleNextProblem} className="bg-neon-blue text-black font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform animate-glow">
                      {currentProblemIndex < problemList.length - 1 ? 'Next Problem →' : 'Finish Level'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}