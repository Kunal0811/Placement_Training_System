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

export default function CNotes() {
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
      <h1 className="text-5xl font-bold mb-10 text-center text-white text-glow">C Programming Notes</h1>

      <NoteSection title="Introduction to C">
        <p>
          C is a powerful general-purpose programming language developed by Dennis Ritchie 
          in 1972 at Bell Labs. It is widely used for system programming, embedded systems, 
          operating systems, and competitive coding. C provides low-level memory access, 
          making it very fast, yet supports structured programming, making it flexible.
        </p>
      </NoteSection>

      <NoteSection title="Data Types in C">
        <p>C supports a variety of data types which are categorized as follows:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li><b>Basic Types:</b> `int`, `char`, `float`, `double`</li>
          <li><b>Derived Types:</b> Arrays, Pointers, Structures, Unions</li>
          <li><b>Enumeration:</b> `enum` (user-defined constants)</li>
          <li><b>Void:</b> represents no value</li>
        </ul>
      </NoteSection>

      <NoteSection title="Control Statements">
        <p>Control statements allow decision making and looping in C.</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li><b>If-Else:</b> Used for decision making.</li>
          <li><b>Switch:</b> Multi-way branching.</li>
          <li><b>Loops:</b> `for`, `while`, `do-while` loops to repeat code execution.</li>
          <li><b>Break & Continue:</b> Control loop execution.</li>
        </ul>
      </NoteSection>

      <NoteSection title="Functions in C">
        <p>Functions allow modular programming by breaking tasks into reusable blocks.</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Predefined functions (`printf`, `scanf`, `strlen`, etc.)</li>
          <li>User-defined functions</li>
          <li>Recursion: Functions calling themselves</li>
          <li>Passing parameters: Call by value vs Call by reference</li>
        </ul>
      </NoteSection>

      <NoteSection title="Arrays and Pointers">
        <p>Arrays store multiple values of the same type, while pointers store memory addresses.</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>1D, 2D, and Multi-dimensional arrays</li>
          <li>Pointers and pointer arithmetic</li>
          <li>Pointers with arrays and functions</li>
          <li>Dynamic memory allocation (`malloc`, `calloc`, `free`, `realloc`)</li>
        </ul>
      </NoteSection>

      <NoteSection title="Structures and Unions">
        <p>Structures and Unions are used to group different data types under one name.</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li><b>Structures:</b> Store heterogeneous data (e.g., student record with name, age, marks).</li>
          <li><b>Unions:</b> Share memory among all members (saves space but only one member can hold value at a time).</li>
          <li><b>typedef:</b> Used to create new type names.</li>
        </ul>
      </NoteSection>
      
      <NoteSection title="File Handling">
        <p>File handling in C allows us to store and retrieve data from files.</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Opening and closing files using <code>fopen()</code> and <code>fclose()</code></li>
          <li>Reading/Writing: <code>fprintf()</code>, <code>fscanf()</code>, <code>fgets()</code>, <code>fputs()</code></li>
          <li>Binary file operations</li>
          <li>Error handling in file operations</li>
        </ul>
      </NoteSection>

      <NoteSection title="Video Tutorials">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/irqbmMNs2Bo"
              title="C Language Full Course"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/8PopR3x-VMY"
              title="Pointers in C"
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
          to={`/technical/modes/C Programming`}
          className="inline-block bg-neon-pink text-black font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform animate-glow"
        >
          🚀 Start Test
        </Link>
      </section>
    </div>
  );
}