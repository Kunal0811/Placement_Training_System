// src/pages/Technical/PythonNotes.jsx
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
    </div>
  );
}