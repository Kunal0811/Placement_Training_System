// src/pages/Technical/DSANotes.jsx
export default function DSANotes() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Data Structures & Algorithms (DSA)</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Common Data Structures</h2>
        <p className="text-gray-700 mb-2">Data structures are ways of organizing and storing data so that they can be accessed and worked with efficiently.</p>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
          <li><b>Arrays:</b> A simple structure that stores elements of the same type in a contiguous block of memory. Fast access by index, but slow for insertions and deletions.</li>
          <li><b>Linked Lists:</b> Elements are stored in "nodes" that contain data and a pointer to the next node. Flexible for insertions/deletions, but slower for access.</li>
          <li><b>Stacks & Queues:</b> Linear data structures with specific rules for adding and removing elements. Stacks are Last-In, First-Out (LIFO), used in recursion and undo operations. Queues are First-In, First-Out (FIFO), used for task scheduling.</li>
          <li><b>Trees:</b> Hierarchical structures with a root node and child nodes. Binary Search Trees (BSTs) are efficient for searching and sorting.</li>
          <li><b>Graphs:</b> A collection of nodes (vertices) and edges that connect them. Used to model networks, like social networks or road maps.</li>
          <li><b>Hash Tables:</b> Use a hash function to map keys to values for highly efficient lookups. The foundation for dictionaries and maps in many languages.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Important Algorithms</h2>
        <p className="text-gray-700 mb-2">Algorithms are step-by-step instructions for solving a problem or accomplishing a task.</p>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
          <li><b>Sorting Algorithms:</b> Methods for rearranging a collection of items into a specific order. <b>Merge Sort</b> and <b>Quick Sort</b> are popular for their efficiency (O(n log n)).</li>
          <li><b>Searching Algorithms:</b> <b>Binary Search</b> is a highly efficient algorithm (O(log n)) for finding an item in a sorted array by repeatedly dividing the search interval in half.</li>
          <li><b>Graph Traversal:</b> <b>Breadth-First Search (BFS)</b> explores neighbor nodes first, while <b>Depth-First Search (DFS)</b> explores as far as possible along each branch before backtracking.</li>
          <li><b>Dynamic Programming:</b> An optimization technique for solving complex problems by breaking them into simpler subproblems and storing the results to avoid redundant calculations.</li>
        </ul>
      </section>
    </div>
  );
}