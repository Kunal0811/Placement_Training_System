// src/pages/Technical/CppNotes.jsx
import { Link } from 'react-router-dom';

export default function CppNotes() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">C++ Programming Notes</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Introduction to C++</h2>
        <p className="text-gray-700 leading-relaxed">
          C++ is a powerful, high-performance general-purpose programming language. It was developed by Bjarne Stroustrup as an extension of the C language, adding object-oriented features. C++ is widely used in systems programming, game development, embedded systems, and financial applications.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Object-Oriented Programming (OOP) in C++</h2>
        <p className="mb-2 text-gray-700">OOP is a paradigm based on the concept of "objects", which can contain data and code. The four main pillars of OOP are:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
          <li><b>Encapsulation:</b> The bundling of data (attributes) and methods (functions) that operate on the data into a single unit called a class. It restricts direct access to some of an object's components, which is a key part of data hiding.</li>
          <li><b>Abstraction:</b> Hiding complex implementation details and showing only the essential features of the object. For example, a driver knows how to use a car's pedals without needing to know how the engine works.</li>
          <li><b>Inheritance:</b> The mechanism by which one class (child/derived) can inherit the properties and methods of another class (parent/base). This promotes code reusability.</li>
          <li><b>Polymorphism:</b> The ability of an object to take on many forms. It allows a single interface to represent different underlying forms (data types). This is achieved through function overloading (compile-time polymorphism) and virtual functions (run-time polymorphism).</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Standard Template Library (STL)</h2>
        <p className="text-gray-700 leading-relaxed">
          The STL is a powerful set of C++ template classes that provide general-purpose classes and functions with templates that implement many popular and commonly used algorithms and data structures.
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
          <li><b>Containers:</b> Data structures that store collections of objects. Examples include `vector` (dynamic array), `list` (doubly-linked list), `deque`, `set` (stores unique elements), and `map` (stores key-value pairs).</li>
          <li><b>Algorithms:</b> A collection of functions for operating on containers, such as `sort()`, `find()`, `reverse()`, `count()`.</li>
          <li><b>Iterators:</b> Objects that act like pointers and are used to traverse through the elements of a container.</li>
        </ul>
      </section>

       <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Other Key Concepts</h2>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
          <li><b>Pointers and References:</b> C++ provides powerful tools for memory management through pointers (variables that store memory addresses) and references (aliases for existing variables).</li>
          <li><b>Memory Management:</b> Manual memory management using `new` and `delete` operators, as well as smart pointers (`unique_ptr`, `shared_ptr`, `weak_ptr`) for automatic memory management.</li>
          <li><b>Templates:</b> Allow functions and classes to operate with generic types, enabling you to write flexible and reusable code.</li>
        </ul>
      </section>

       {/* --- Video Tutorials Section --- */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Video Tutorials</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border"
              src="https://www.youtube.com/embed/vLnPwxZdW4Y"
              title="C++ Full Course"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border"
              src="https://www.youtube.com/embed/pTB0EiLXUC8"
              title="C++ OOP Concepts"
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
          to={`/technical/modes/C++ Programming`}
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition-transform hover:scale-105"
        >
          🚀 Start Test
        </Link>
      </section>
    </div>
  );
}