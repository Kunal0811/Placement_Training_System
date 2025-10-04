// src/pages/Technical/JavaNotes.jsx
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
    </div>
  );
}