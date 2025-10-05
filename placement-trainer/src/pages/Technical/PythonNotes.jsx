// src/pages/Technical/PythonNotes.jsx
import { Link } from 'react-router-dom';

export default function PythonNotes() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Python Programming Notes</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Introduction to Python</h2>
        <p className="text-gray-700 leading-relaxed">
          Python is an interpreted, high-level, and general-purpose programming language. Its design philosophy emphasizes code readability, and its syntax allows programmers to express concepts in fewer lines of code than would be possible in languages like C++ or Java.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Key Features of Python</h2>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
          <li><b>Simple and Readable:</b> Python's clean syntax makes it easy to read and write, reducing the cost of program maintenance.</li>
          <li><b>Interpreted and Dynamically Typed:</b> Code is executed line by line, and variable types are determined at runtime, which allows for rapid prototyping.</li>
          <li><b>Extensive Standard Library:</b> Python's "batteries-included" philosophy means it comes with a large library of modules for common tasks like string manipulation, web services, and OS interaction.</li>
          <li><b>Vibrant Ecosystem:</b> A massive collection of third-party packages for various domains, including web development (Django, Flask), data science (NumPy, Pandas, Scikit-learn), and machine learning (TensorFlow, PyTorch).</li>
          <li><b>Object-Oriented:</b> Python supports object-oriented programming, allowing for the creation of reusable and organized code through classes and objects.</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Common Data Structures</h2>
        <p className="text-gray-700">Python provides several built-in data structures that are powerful and easy to use:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
            <li><b>Lists:</b> Ordered, mutable collections of items. <code>my_list = [1, "hello", 3.14]</code></li>
            <li><b>Tuples:</b> Ordered, immutable collections of items. <code>my_tuple = (1, "hello", 3.14)</code></li>
            {/* Fix: Wrap the code examples with curly braces in a string literal */}
            <li><b>Dictionaries:</b> Unordered collections of key-value pairs. <code>{'my_dict = {"name": "John", "age": 30}'}</code></li>
            <li><b>Sets:</b> Unordered collections of unique items. <code>{'my_set = {1, 2, 3}'}</code></li>
        </ul>
      </section>

       {/* --- Video Tutorials Section --- */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Video Tutorials</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border"
              src="https://www.youtube.com/embed/rfscVS0vtbw"
              title="Python Full Course"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border"
              src="https://www.youtube.com/embed/f9Aje_cN_CY"
              title="Python Data Structures"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      <section className="mt-8 pt-6 border-t-2 border-dashed">
        <h2 className="text-2xl font-semibold mb-3">Practice Test</h2>
        <p className="text-gray-700 mb-4">
          Ready to test your knowledge? Take a practice test with AI-generated questions.
        </p>
        <Link
          to={`/technical/modes/Python Programming`}
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition-transform hover:scale-105"
        >
          🚀 Start Test
        </Link>
      </section>
    </div>
  );
}