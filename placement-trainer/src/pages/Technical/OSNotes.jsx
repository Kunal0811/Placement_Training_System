// src/pages/Technical/OSNotes.jsx
import { Link } from 'react-router-dom';

export default function OSNotes() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Operating Systems (OS) Notes</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Core OS Concepts</h2>
        <p className="text-gray-700 mb-2">An Operating System is the software that manages computer hardware and provides common services for computer programs.</p>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
          <li><b>Processes and Threads:</b> A <b>process</b> is a program in execution (e.g., running Chrome). A <b>thread</b> is a lightweight unit within a process (e.g., a single tab in Chrome). Threads within a process share the same memory space.</li>
          <li><b>CPU Scheduling:</b> The process of deciding which ready process will be allocated the CPU. Algorithms like <b>Round Robin</b> (giving each process a small time slice) and <b>Priority Scheduling</b> aim to ensure fairness and efficiency.</li>
          <li><b>Memory Management:</b> The OS is responsible for allocating and deallocating memory space. Techniques like <b>Paging</b> (dividing memory into fixed-size blocks) and <b>Segmentation</b> are used to manage virtual memory.</li>
          <li><b>Synchronization:</b> When multiple threads or processes access shared resources, their execution must be coordinated to avoid data corruption. <b>Mutexes</b> (locks) and <b>Semaphores</b> are common tools for this.</li>
          <li><b>Deadlock:</b> A critical situation where two or more processes are blocked forever, waiting for each other. The OS must either prevent, avoid, or detect and recover from deadlocks.</li>
        </ul>
      </section>

      {/* --- Video Tutorials Section --- */}
      {/* --- Video Tutorials Section --- */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Video Tutorials</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border"
              src="https://www.youtube.com/embed/vBURTt97EkA"
              title="Operating Systems Full Course"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border"
              src="https://www.youtube.com/embed/OSXqpsINSlQ"
              title="CPU Scheduling Algorithms"
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
          to={`/technical/modes/Operating Systems`}
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition-transform hover:scale-105"
        >
          🚀 Start Test
        </Link>
      </section>
    </div>
  );
}