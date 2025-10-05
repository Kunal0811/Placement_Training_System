// src/pages/Technical/JavaNotes.jsx
import { Link } from 'react-router-dom';

export default function JavaNotes() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Java Programming Notes</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Introduction to Java</h2>
        <p className="text-gray-700 leading-relaxed">
          Java is a high-level, class-based, object-oriented programming language known for its "Write Once, Run Anywhere" (WORA) capability. Developed by Sun Microsystems, it's widely used for building web applications, mobile apps (Android), and large-scale enterprise systems.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">The Java Platform</h2>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
          <li><b>Java Virtual Machine (JVM):</b> The runtime engine of the Java Platform. The JVM is responsible for executing Java bytecode. It's what makes Java platform-independent.</li>
          <li><b>Java Development Kit (JDK):</b> A software development environment used for developing Java applications. It includes the JRE, a compiler (`javac`), an archiver (`jar`), and other tools.</li>
          <li><b>Java Runtime Environment (JRE):</b> A part of the JDK that provides the minimum requirements for executing a Java application; it consists of the JVM, core classes, and supporting files.</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Core Java Concepts</h2>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
          <li><b>Object-Oriented Programming:</b> Java is purely object-oriented. Everything in Java is an object (with a few exceptions for primitive types).</li>
          <li><b>Automatic Garbage Collection:</b> Java automatically manages memory. The garbage collector finds and deletes objects that are no longer in use, preventing memory leaks.</li>
          <li><b>Collections Framework:</b> A powerful and unified architecture for representing and manipulating collections. Includes interfaces like `List`, `Set`, `Map` and implementations like `ArrayList`, `HashSet`, `HashMap`.</li>
          <li><b>Exception Handling:</b> A robust mechanism to handle runtime errors using `try`, `catch`, `finally`, and `throw` keywords, preventing program crashes.</li>
          <li><b>Multithreading:</b> Java provides built-in support for concurrent programming by allowing multiple threads to run simultaneously, improving the performance of complex applications.</li>
        </ul>
      </section>

      {/* --- Video Tutorials Section --- */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Video Tutorials</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border"
              src="https://www.youtube.com/embed/eIrMbAQSU34"
              title="Java Full Course"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border"
              src="https://www.youtube.com/embed/bSrm9RXwBaI"
              title="Java OOP Concepts"
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
          to={`/technical/modes/Java Programming`}
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition-transform hover:scale-105"
        >
          🚀 Start Test
        </Link>
      </section>
    </div>
  );
}