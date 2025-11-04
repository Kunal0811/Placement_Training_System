import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NoteSection = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-3xl font-bold mb-4 text-neon-blue text-glow">{title}</h2>
    <div className="space-y-4 text-gray-300 leading-relaxed">
      {children}
    </div>
  </section>
);

export default function DSANotes() {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto p-8 bg-dark-card rounded-2xl border border-neon-blue/20">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center text-neon-blue hover:text-white transition-colors"
      >
        <span className="text-2xl mr-2">←</span>
        Back
      </button>
      <h1 className="text-5xl font-bold mb-10 text-center text-white text-glow">Data Structures & Algorithms (DSA)</h1>

      <NoteSection title="Common Data Structures">
        <p>Data structures are ways of organizing and storing data so that they can be accessed and worked with efficiently.</p>
        <ul className="list-disc pl-6 mt-2 space-y-3">
          <li><b>Arrays:</b> A simple structure that stores elements of the same type in a contiguous block of memory. Fast access by index, but slow for insertions and deletions.</li>
          <li><b>Linked Lists:</b> Elements are stored in "nodes" that contain data and a pointer to the next node. Flexible for insertions/deletions, but slower for access.</li>
          <li><b>Stacks & Queues:</b> Linear data structures with specific rules for adding and removing elements. Stacks are Last-In, First-Out (LIFO), used in recursion and undo operations. Queues are First-In, First-Out (FIFO), used for task scheduling.</li>
          <li><b>Trees:</b> Hierarchical structures with a root node and child nodes. Binary Search Trees (BSTs) are efficient for searching and sorting.</li>
          <li><b>Graphs:</b> A collection of nodes (vertices) and edges that connect them. Used to model networks, like social networks or road maps.</li>
          <li><b>Hash Tables:</b> Use a hash function to map keys to values for highly efficient lookups. The foundation for dictionaries and maps in many languages.</li>
        </ul>
      </NoteSection>

      <NoteSection title="Important Algorithms">
        <p>Algorithms are step-by-step instructions for solving a problem or accomplishing a task.</p>
        <ul className="list-disc pl-6 mt-2 space-y-3">
          <li><b>Sorting Algorithms:</b> Methods for rearranging a collection of items into a specific order. <b>Merge Sort</b> and <b>Quick Sort</b> are popular for their efficiency (O(n log n)).</li>
          <li><b>Searching Algorithms:</b> <b>Binary Search</b> is a highly efficient algorithm (O(log n)) for finding an item in a sorted array by repeatedly dividing the search interval in half.</li>
          <li><b>Graph Traversal:</b> <b>Breadth-First Search (BFS)</b> explores neighbor nodes first, while <b>Depth-First Search (DFS)</b> explores as far as possible along each branch before backtracking.</li>
          <li><b>Dynamic Programming:</b> An optimization technique for solving complex problems by breaking them into simpler subproblems and storing the results to avoid redundant calculations.</li>
        </ul>
      </NoteSection>

      <NoteSection title="Video Tutorials">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/8hly31xKli0"
              title="DSA Full Course"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/__vX2sjlpXU"
              title="Big O Notation Explained"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </NoteSection>

      <section className="mt-12 pt-8 border-t-2 border-dashed border-neon-pink/20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-neon-pink text-glow">Practice Test</h2>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          Ready to test your knowledge? Take a practice test with AI-generated questions.
        </p>
        <Link
          to={`/technical/modes/Data Structures & Algorithms`}
          className="inline-block bg-neon-pink text-black font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform animate-glow"
        >
          🚀 Start Test
        </Link>
      </section>
    </div>
  );
}