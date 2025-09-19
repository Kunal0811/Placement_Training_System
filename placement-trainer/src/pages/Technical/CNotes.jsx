// src/pages/Technical/CNotes.jsx
export default function CNotes() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">C Programming Notes</h1>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Introduction to C</h2>
        <p className="text-gray-700 leading-relaxed">
          C is a powerful general-purpose programming language developed by Dennis Ritchie 
          in 1972 at Bell Labs. It is widely used for system programming, embedded systems, 
          operating systems, and competitive coding. C provides low-level memory access, 
          making it very fast, yet supports structured programming, making it flexible.
        </p>
      </section>

      {/* Data Types */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Data Types in C</h2>
        <p className="text-gray-700 leading-relaxed">
          C supports a variety of data types which are categorized as follows:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
          <li><b>Basic Types:</b>int, char, float, double</li>
          <li><b>Derived Types:</b> Arrays, Pointers, Structures, Unions</li>
          <li><b>Enumeration:</b> enum (user-defined constants)</li>
          <li><b>Void:</b> represents no value</li>
        </ul>
      </section>

      {/* Control Statements */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Control Statements</h2>
        <p className="text-gray-700 leading-relaxed">
          Control statements allow decision making and looping in C.
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
          <li><b>If-Else:</b> Used for decision making.</li>
          <li><b>Switch:</b> Multi-way branching.</li>
          <li><b>Loops:</b> for, while, do-while loops to repeat code execution.</li>
          <li><b>Break & Continue:</b> Control loop execution.</li>
        </ul>
      </section>

      {/* Functions */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Functions in C</h2>
        <p className="text-gray-700 leading-relaxed">
          Functions allow modular programming by breaking tasks into reusable blocks.
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
          <li>Predefined functions (printf, scanf, strlen, etc.)</li>
          <li>User-defined functions</li>
          <li>Recursion: Functions calling themselves</li>
          <li>Passing parameters: Call by value vs Call by reference</li>
        </ul>
      </section>

      {/* Arrays and Pointers */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Arrays and Pointers</h2>
        <p className="text-gray-700 leading-relaxed">
          Arrays store multiple values of the same type, while pointers store memory addresses.
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
          <li>1D, 2D, and Multi-dimensional arrays</li>
          <li>Pointers and pointer arithmetic</li>
          <li>Pointers with arrays and functions</li>
          <li>Dynamic memory allocation (malloc, calloc, free, realloc)</li>
        </ul>
      </section>

      {/* Structures & Unions */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Structures and Unions</h2>
        <p className="text-gray-700 leading-relaxed">
          Structures and Unions are used to group different data types under one name.
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
          <li><b>Structures:</b> Store heterogeneous data (e.g., student record with name, age, marks).</li>
          <li><b>Unions:</b> Share memory among all members (saves space but only one member can hold value at a time).</li>
          <li><b>typedef:</b> Used to create new type names.</li>
        </ul>
      </section>

      {/* File Handling */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">File Handling</h2>
        <p className="text-gray-700 leading-relaxed">
          File handling in C allows us to store and retrieve data from files.
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
          <li>Opening and closing files using <code>fopen()</code> and <code>fclose()</code></li>
          <li>Reading/Writing: <code>fprintf()</code>, <code>fscanf()</code>, <code>fgets()</code>, <code>fputs()</code></li>
          <li>Binary file operations</li>
          <li>Error handling in file operations</li>
        </ul>
      </section>

      {/* Conclusion */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Conclusion</h2>
        <p className="text-gray-700 leading-relaxed">
          C programming forms the foundation of computer science. Mastering C helps 
          in learning advanced programming languages, understanding memory management, 
          and preparing for placements, especially in technical interviews where C 
          concepts like pointers, arrays, and memory are frequently asked.
        </p>
      </section>
    </div>
  );
}
