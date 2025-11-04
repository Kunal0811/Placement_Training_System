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

export default function PythonNotes() {
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
      <h1 className="text-5xl font-bold mb-10 text-center text-white text-glow">Python Programming Notes</h1>

      <NoteSection title="Introduction to Python">
        <p>
          Python is an interpreted, high-level, and general-purpose programming language. Its design philosophy emphasizes code readability, and its syntax allows programmers to express concepts in fewer lines of code than would be possible in languages like C++ or Java.
        </p>
      </NoteSection>

      <NoteSection title="Key Features of Python">
        <ul className="list-disc pl-6 mt-2 space-y-3">
          <li><b>Simple and Readable:</b> Python's clean syntax makes it easy to read and write, reducing the cost of program maintenance.</li>
          <li><b>Interpreted and Dynamically Typed:</b> Code is executed line by line, and variable types are determined at runtime, which allows for rapid prototyping.</li>
          <li><b>Extensive Standard Library:</b> Python's "batteries-included" philosophy means it comes with a large library of modules for common tasks like string manipulation, web services, and OS interaction.</li>
          <li><b>Vibrant Ecosystem:</b> A massive collection of third-party packages for various domains, including web development (Django, Flask), data science (NumPy, Pandas, Scikit-learn), and machine learning (TensorFlow, PyTorch).</li>
          <li><b>Object-Oriented:</b> Python supports object-oriented programming, allowing for the creation of reusable and organized code through classes and objects.</li>
        </ul>
      </NoteSection>
      
      <NoteSection title="Common Data Structures">
        <p>Python provides several built-in data structures that are powerful and easy to use:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><b>Lists:</b> Ordered, mutable collections of items. <code className="bg-dark-bg p-1 rounded-md text-neon-pink">my_list = [1, "hello", 3.14]</code></li>
            <li><b>Tuples:</b> Ordered, immutable collections of items. <code className="bg-dark-bg p-1 rounded-md text-neon-pink">my_tuple = (1, "hello", 3.14)</code></li>
            <li><b>Dictionaries:</b> Unordered collections of key-value pairs. <code className="bg-dark-bg p-1 rounded-md text-neon-pink">{'my_dict = {"name": "John", "age": 30}'}</code></li>
            <li><b>Sets:</b> Unordered collections of unique items. <code className="bg-dark-bg p-1 rounded-md text-neon-pink">{'my_set = {1, 2, 3}'}</code></li>
        </ul>
      </NoteSection>

      <NoteSection title="Video Tutorials">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/rfscVS0vtbw"
              title="Python Full Course"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/f9Aje_cN_CY"
              title="Python Data Structures"
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
          to={`/technical/modes/Python Programming`}
          className="inline-block bg-neon-pink text-black font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform animate-glow"
        >
          🚀 Start Test
        </Link>
      </section>
    </div>
  );
}