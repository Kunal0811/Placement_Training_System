import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import API_BASE from '../../api';

const boilerplate = {
  python: `import sys

def solve():
    # Your solution logic here.

# Main execution block
if __name__ == "__main__":
    solve()
`,
  java: `import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

class MyClass {
    public static void main(String[] args) {
        // Your solution logic here.

    }
}`,
  cpp: `#include <iostream>
#include <string>
#include <vector>

int main() {
    // Your solution logic here.
    
}`,
};

export default function CodingPlatform() {
  const [problem, setProblem] = useState(null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [output, setOutput] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [difficulty, setDifficulty] = useState('easy');
  const [code, setCode] = useState(boilerplate.python);
  const [language, setLanguage] = useState('python');
  
  const languageExtensions = {
    python: [python()],
    java: [java()],
    cpp: [cpp()],
  };

  const handleGenerateProblem = async () => {
    setIsLoadingProblem(true);
    setProblem(null);
    setEvaluation(null);
    setOutput("");
    try {
      const res = await fetch(`${API_BASE}/api/coding/generate-problem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to fetch problem');
      }
      const data = await res.json();
      setProblem(data);
      if (data.examples && data.examples.length > 0) {
        // A more robust way to handle different example formats
        const exampleInput = data.examples[0].input.replace(/nums = |target = /g, "").replace(/, /g, '\n');
        setCustomInput(exampleInput);
      }
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoadingProblem(false);
    }
  };
  
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("");
    try {
        const res = await fetch(`${API_BASE}/api/coding/run-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, language, input: customInput }),
        });
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.detail || 'Failed to run code');
        }
        const data = await res.json();
        if (!data.output || data.output.trim() === "") {
            setOutput("Execution finished with no output.");
        } else {
            setOutput(data.output);
        }
    } catch (err) {
        console.error(err);
        setOutput(`Error: ${err.message}`);
    } finally {
        setIsRunning(false);
    }
  };

  const handleEvaluateCode = async () => {
    if (!problem) return;
    setIsEvaluating(true);
    setEvaluation(null);
    try {
        const res = await fetch(`${API_BASE}/api/coding/evaluate-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ problem, code, language }),
        });
        if (!res.ok) throw new Error('Failed to evaluate code');
        const data = await res.json();
        setEvaluation(data);
    } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}`);
    } finally {
        setIsEvaluating(false);
    }
  };

  useEffect(() => {
    handleGenerateProblem();
  }, [difficulty]);

  useEffect(() => {
    setCode(boilerplate[language]);
  }, [language]);

  return (
    <div className="p-4 bg-gray-100 min-h-full">
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/2">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Coding Problem</h1>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="p-2 border rounded" disabled={isLoadingProblem}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <div className="bg-white p-4 rounded-lg shadow min-h-[500px]">
                    {isLoadingProblem && <p>Generating a new problem...</p>}
                    {problem && !isLoadingProblem && (
                        <div>
                          <h2 className="text-xl font-semibold mb-2">{problem.title}</h2>
                          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{problem.description}</p>
                          <h3 className="font-semibold">Input Format:</h3>
                          <p className="text-gray-600 mb-3">{problem.input_format}</p>
                          <h3 className="font-semibold">Output Format:</h3>
                          <p className="text-gray-600 mb-4">{problem.output_format}</p>
                          {problem.constraints && <div className="mb-4"><h3 className="font-semibold">Constraints:</h3><ul className="list-disc pl-5 text-gray-600">{problem.constraints.map((c, i) => <li key={i}>{c}</li>)}</ul></div>}
                          {problem.examples?.map((ex, i) => (
                            <div key={i} className="mt-4">
                              <h3 className="font-semibold">Example {i + 1}:</h3>
                              <pre className="bg-gray-200 p-2 rounded mt-1 text-sm whitespace-pre-wrap font-sans">
                                <code>
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
                <button onClick={handleGenerateProblem} disabled={isLoadingProblem} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                    {isLoadingProblem ? 'Generating...' : 'Generate New Problem'}
                </button>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Code Editor</h2>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-2 border rounded">
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                    </select>
                </div>
                <div className="h-[500px] border rounded-lg overflow-hidden shadow">
                    <CodeMirror value={code} height="500px" extensions={languageExtensions[language]} onChange={(value) => setCode(value)} theme="light" style={{ fontSize: '16px' }} />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-4 h-48">
                    <div className="w-full sm:w-1/2 flex flex-col">
                        <h3 className="font-semibold mb-1">Custom Input</h3>
                        <textarea value={customInput} onChange={(e) => setCustomInput(e.target.value)} className="w-full flex-grow border rounded-md p-2 font-mono text-sm" placeholder="Enter input..."/>
                    </div>
                    <div className="w-full sm:w-1/2 flex flex-col">
                        <h3 className="font-semibold mb-1">Output</h3>
                        <pre className="w-full flex-grow border rounded-md p-2 font-mono text-sm bg-gray-50 overflow-auto">
                            {isRunning ? "Running..." : output}
                        </pre>
                    </div>
                </div>

                <div className="mt-4 flex gap-4">
                    <button onClick={handleRunCode} disabled={isRunning || isEvaluating} className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400">
                        {isRunning ? 'Running...' : '▶️ Run Code'}
                    </button>
                    <button onClick={handleEvaluateCode} disabled={isEvaluating || isRunning} className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                        {isEvaluating ? 'Evaluating...' : 'Submit & Evaluate'}
                    </button>
                </div>
            </div>
        </div>

        {(isEvaluating || evaluation) && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-2">Evaluation Result</h2>
                {isEvaluating && <p className="text-gray-600">The AI is analyzing your code. Please wait...</p>}
                {evaluation && (
                    <div className={`p-4 rounded-lg ${evaluation.is_correct ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'} border-l-4`}>
                        <h3 className={`text-lg font-bold ${evaluation.is_correct ? 'text-green-800' : 'text-red-800'}`}>
                            {evaluation.is_correct ? '✅ Correct Solution' : '❌ Needs Improvement'}
                        </h3>
                        <ul className="mt-2 text-gray-800 list-disc pl-5 space-y-1">
                            {evaluation.feedback_points && evaluation.feedback_points.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                        <div className="mt-4 flex items-center gap-6 text-sm">
                            <p className="font-medium">Time Complexity:<code className={`ml-2 px-2 py-1 rounded-md ${evaluation.is_correct ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>{evaluation.time_complexity}</code></p>
                            <p className="font-medium">Space Complexity:<code className={`ml-2 px-2 py-1 rounded-md ${evaluation.is_correct ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>{evaluation.space_complexity}</code></p>
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );
}