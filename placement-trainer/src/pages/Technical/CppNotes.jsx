import React from 'react';
import { Link } from 'react-router-dom';

const NoteSection = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-3xl font-bold mb-4 text-neon-blue text-glow">{title}</h2>
    <div className="space-y-4 text-gray-300 leading-relaxed">
      {children}
    </div>
  </section>
);

export default function CppNotes() {
  return (
    <div className="max-w-5xl mx-auto p-8 bg-dark-card rounded-2xl border border-neon-blue/20">
      <h1 className="text-5xl font-bold mb-10 text-center text-white text-glow">C++ Programming Notes</h1>

      <NoteSection title="Introduction to C++">
        <p>
          C++ is a powerful, high-performance general-purpose programming language. It was developed by Bjarne Stroustrup as an extension of the C language, adding object-oriented features. C++ is widely used in systems programming, game development, embedded systems, and financial applications.
        </p>
      </NoteSection>

      <NoteSection title="Object-Oriented Programming (OOP) in C++">
        <p>OOP is a paradigm based on the concept of "objects", which can contain data and code. The four main pillars of OOP are:</p>
        <ul className="list-disc pl-6 mt-2 space-y-3">
          <li><b>Encapsulation:</b> The bundling of data (attributes) and methods (functions) that operate on the data into a single unit called a class. It restricts direct access to some of an object's components.</li>
          <li><b>Abstraction:</b> Hiding complex implementation details and showing only the essential features of the object. For example, a driver uses a car's pedals without needing to know how the engine works.</li>
          <li><b>Inheritance:</b> The mechanism by which one class (child/derived) can inherit the properties and methods of another class (parent/base). This promotes code reusability.</li>
          <li><b>Polymorphism:</b> The ability of an object to take on many forms. It allows a single interface to represent different underlying forms, achieved through function overloading and virtual functions.</li>
        </ul>
      </NoteSection>

      <NoteSection title="Standard Template Library (STL)">
        <p>
          The STL is a powerful set of C++ template classes that provide general-purpose classes and functions with templates that implement many popular and commonly used algorithms and data structures.
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li><b>Containers:</b> Data structures like `vector`, `list`, `deque`, `set`, and `map`.</li>
          <li><b>Algorithms:</b> A collection of functions for operating on containers, such as `sort()`, `find()`, `reverse()`.</li>
          <li><b>Iterators:</b> Objects that act like pointers and are used to traverse through the elements of a container.</li>
        </ul>
      </NoteSection>

      <NoteSection title="Other Key Concepts">
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li><b>Pointers and References:</b> C++ provides powerful tools for memory management through pointers and references.</li>
          <li><b>Memory Management:</b> Manual management using `new`/`delete` and automatic management via smart pointers (`unique_ptr`, `shared_ptr`).</li>
          <li><b>Templates:</b> Allow functions and classes to operate with generic types, enabling flexible and reusable code.</li>
        </ul>
      </NoteSection>

      <NoteSection title="Video Tutorials">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/vLnPwxZdW4Y"
              title="C++ Full Course"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/pTB0EiLXUC8"
              title="C++ OOP Concepts"
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
          to={`/technical/modes/C++ Programming`}
          className="inline-block bg-neon-pink text-black font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform animate-glow"
        >
          🚀 Start Test
        </Link>
      </section>
    </div>
  );
}