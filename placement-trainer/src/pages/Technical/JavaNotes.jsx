import React from 'react';
import { Link,useNavigate } from 'react-router-dom';

const NoteSection = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-3xl font-bold mb-4 text-neon-blue text-glow">{title}</h2>
    <div className="space-y-4 text-gray-300 leading-relaxed">
      {children}
    </div>
  </section>
);

export default function JavaNotes() {
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
      <h1 className="text-5xl font-bold mb-10 text-center text-white text-glow">Java Programming Notes</h1>

      <NoteSection title="Introduction to Java">
        <p>
          Java is a high-level, class-based, object-oriented programming language known for its "Write Once, Run Anywhere" (WORA) capability. Developed by Sun Microsystems, it's widely used for building web applications, mobile apps (Android), and large-scale enterprise systems.
        </p>
      </NoteSection>

      <NoteSection title="The Java Platform">
        <ul className="list-disc pl-6 mt-2 space-y-3">
          <li><b>Java Virtual Machine (JVM):</b> The runtime engine of the Java Platform. The JVM is responsible for executing Java bytecode. It's what makes Java platform-independent.</li>
          <li><b>Java Development Kit (JDK):</b> A software development environment used for developing Java applications. It includes the JRE, a compiler (`javac`), an archiver (`jar`), and other tools.</li>
          <li><b>Java Runtime Environment (JRE):</b> A part of the JDK that provides the minimum requirements for executing a Java application; it consists of the JVM, core classes, and supporting files.</li>
        </ul>
      </NoteSection>
      
      <NoteSection title="Core Java Concepts">
        <ul className="list-disc pl-6 mt-2 space-y-3">
          <li><b>Object-Oriented Programming:</b> Java is purely object-oriented. Everything in Java is an object (with a few exceptions for primitive types).</li>
          <li><b>Automatic Garbage Collection:</b> Java automatically manages memory. The garbage collector finds and deletes objects that are no longer in use, preventing memory leaks.</li>
          <li><b>Collections Framework:</b> A powerful and unified architecture for representing and manipulating collections. Includes interfaces like `List`, `Set`, `Map` and implementations like `ArrayList`, `HashSet`, `HashMap`.</li>
          <li><b>Exception Handling:</b> A robust mechanism to handle runtime errors using `try`, `catch`, `finally`, and `throw` keywords, preventing program crashes.</li>
          <li><b>Multithreading:</b> Java provides built-in support for concurrent programming by allowing multiple threads to run simultaneously, improving the performance of complex applications.</li>
        </ul>
      </NoteSection>

      <NoteSection title="Video Tutorials">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/eIrMbAQSU34"
              title="Java Full Course"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/bSrm9RXwBaI"
              title="Java OOP Concepts"
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
          to={`/technical/modes/Java Programming`}
          className="inline-block bg-neon-pink text-black font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform animate-glow"
        >
          🚀 Start Test
        </Link>
      </section>
    </div>
  );
}