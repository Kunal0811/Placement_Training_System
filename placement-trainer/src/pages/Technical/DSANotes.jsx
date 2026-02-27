// src/pages/Technical/DSANotes.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCode, FiAlertTriangle, FiCheckCircle, FiBookOpen } from "react-icons/fi";

export default function DSANotes() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("intro");

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-game-bg text-gray-300 pb-20 font-sans leading-relaxed">
      
      {/* Header */}
      <div className="bg-black/60 border-b border-white/10 pt-16 pb-12 px-6 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <span className="text-neon-blue font-bold tracking-widest uppercase text-xs mb-2 block">Technical Hub</span>
            <h1 className="text-4xl md:text-5xl font-black text-white font-display tracking-tight">Data Structures & Algorithms</h1>
            <p className="text-gray-400 mt-3 max-w-2xl text-lg">
              Master the internal workings of memory, time complexities, and algorithmic paradigms to crack top product-based companies.
            </p>
          </div>
          <button 
            onClick={() => navigate('/technical/modes/Data Structures & Algorithms')}
            className="hidden md:flex px-8 py-3 bg-neon-blue text-black font-black rounded-xl hover:scale-105 transition-transform uppercase tracking-widest shadow-[0_0_20px_rgba(45,212,191,0.3)]"
          >
            Take Test
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 px-6 mt-10 relative">
        
        {/* LEFT: Sticky Table of Contents (The G4G Sidebar) */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-48 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm flex items-center gap-2">
              <FiBookOpen className="text-neon-blue"/> Contents
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { id: "intro", title: "1. Big O & Complexity" },
                { id: "arrays", title: "2. Arrays & Strings" },
                { id: "linkedlist", title: "3. Linked Lists" },
                { id: "trees", title: "4. Trees & Graphs" },
                { id: "dp", title: "5. Dynamic Programming" },
              ].map(sec => (
                <li key={sec.id}>
                  <button 
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full text-left transition-colors ${activeSection === sec.id ? 'text-neon-blue font-bold' : 'text-gray-400 hover:text-white'}`}
                  >
                    {sec.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT: Deep Content Area */}
        <div className="flex-1 max-w-4xl space-y-16">
          
          {/* Section 1: Complexity */}
          <section id="intro" className="scroll-mt-40">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-white/10 pb-2">1. Asymptotic Analysis (Big O)</h2>
            <p className="mb-4">
              Big O notation strictly defines the <strong>upper bound</strong> of an algorithm's time or space requirements. Interviewers do not want to hear "it runs fast". They want to know how the algorithm scales as the input size <code className="bg-gray-800 text-pink-400 px-1.5 py-0.5 rounded">N</code> approaches infinity.
            </p>
            
            {/* Custom Table */}
            <div className="bg-black border border-white/10 rounded-xl overflow-hidden my-6">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-gray-400">
                  <tr>
                    <th className="p-4 border-b border-white/10">Notation</th>
                    <th className="p-4 border-b border-white/10">Name</th>
                    <th className="p-4 border-b border-white/10">Example Algorithm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr><td className="p-4 font-mono text-neon-green">O(1)</td><td className="p-4">Constant</td><td className="p-4">Hash Map lookup, Array index access</td></tr>
                  <tr><td className="p-4 font-mono text-yellow-400">O(log N)</td><td className="p-4">Logarithmic</td><td className="p-4">Binary Search, Binary Tree lookup</td></tr>
                  <tr><td className="p-4 font-mono text-orange-400">O(N)</td><td className="p-4">Linear</td><td className="p-4">Linear Search, Array Traversal</td></tr>
                  <tr><td className="p-4 font-mono text-red-400">O(N log N)</td><td className="p-4">Log-Linear</td><td className="p-4">Merge Sort, Quick Sort (avg)</td></tr>
                  <tr><td className="p-4 font-mono text-red-600 font-bold">O(2^N)</td><td className="p-4">Exponential</td><td className="p-4">Recursive Fibonacci, Powerset</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-lg my-6">
              <h4 className="text-blue-400 font-bold flex items-center gap-2 mb-2"><FiAlertTriangle/> Interview Pro-Tip</h4>
              <p className="text-sm text-blue-100">If your array is already sorted, and you are asked to find an element, ALWAYS use Binary Search <code>O(log N)</code>. Using a linear loop <code>O(N)</code> will immediately result in a rejection for optimization inefficiency.</p>
            </div>
          </section>

          {/* Section 2: Arrays */}
          <section id="arrays" className="scroll-mt-40">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-white/10 pb-2">2. Arrays & CPU Caching</h2>
            <p className="mb-4">
              An array is a contiguous block of memory. When you create an array <code>int arr[5]</code>, the OS allocates 5 consecutive memory addresses. 
            </p>
            <p className="mb-6">
              <strong>Why Arrays are insanely fast:</strong> Arrays utilize <em>Spatial Locality</em>. When the CPU fetches <code>arr[0]</code> from RAM, it brings the entire chunk (including <code>arr[1], arr[2]</code>) into the ultra-fast L1 CPU Cache. This makes array traversal mathematically faster than Linked Lists even if both are technically O(N).
            </p>

            {/* Code Snippet */}
            <div className="bg-[#0d1117] border border-gray-800 rounded-xl overflow-hidden mb-6 shadow-2xl">
              <div className="bg-black/50 px-4 py-2 border-b border-gray-800 text-xs font-mono text-gray-500 flex items-center gap-2">
                <FiCode /> Two Pointer Approach (C++)
              </div>
              <pre className="p-4 text-sm font-mono overflow-x-auto text-blue-300">
{`// Reverse an array in O(N) time and O(1) space
void reverseArray(vector<int>& arr) {
    int left = 0;
    int right = arr.size() - 1;
    
    while(left < right) {
        // Swap elements without extra memory
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        
        left++;
        right--;
    }
}`}
              </pre>
            </div>
          </section>

          {/* Section 3: Trees */}
          <section id="trees" className="scroll-mt-40">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-white/10 pb-2">4. Trees & Graphs (Non-Linear)</h2>
            <p className="mb-4">Unlike Arrays which represent linear data, Trees represent hierarchical data. The most tested concept in interviews is the <strong>Binary Search Tree (BST)</strong>.</p>
            
            <ul className="list-disc pl-6 space-y-3 mb-6 marker:text-neon-blue">
              <li><strong>Inorder Traversal:</strong> Left, Root, Right. <em>(Magic Trick: Inorder traversal of a BST always yields a sorted array!)</em></li>
              <li><strong>Preorder Traversal:</strong> Root, Left, Right. <em>(Used for making a copy of a tree)</em></li>
              <li><strong>Postorder Traversal:</strong> Left, Right, Root. <em>(Used for deleting a tree from leaf to root)</em></li>
            </ul>

            <div className="bg-green-500/10 border border-green-500/30 p-5 rounded-xl text-green-100 flex items-start gap-4">
              <FiCheckCircle className="text-green-500 text-2xl flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-green-400 mb-1">Graph Traversal Master Rule</h4>
                <p className="text-sm">Use <strong>BFS (Breadth First Search)</strong> using a Queue when you need to find the "Shortest Path" on an unweighted graph. Use <strong>DFS (Depth First Search)</strong> using recursion/Stack when you want to exhaust all possibilities (like solving a Maze or checking if a path exists).</p>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-black/90 border-t border-white/10 backdrop-blur-xl z-50">
         <button onClick={() => navigate('/technical/modes/Data Structures & Algorithms')} className="w-full py-4 bg-neon-blue text-black font-black rounded-xl uppercase tracking-widest">
            Take Module Test
         </button>
      </div>
    </div>
  );
}