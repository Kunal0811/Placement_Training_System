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

export default function OSNotes() {
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
      <h1 className="text-5xl font-bold mb-10 text-center text-white text-glow">Operating Systems (OS) Notes</h1>

      <NoteSection title="Core OS Concepts">
        <p>An Operating System is the software that manages computer hardware and provides common services for computer programs.</p>
        <ul className="list-disc pl-6 mt-2 space-y-3">
          <li><b>Processes and Threads:</b> A <b>process</b> is a program in execution (e.g., running Chrome). A <b>thread</b> is a lightweight unit within a process (e.g., a single tab in Chrome). Threads within a process share the same memory space.</li>
          <li><b>CPU Scheduling:</b> The process of deciding which ready process will be allocated the CPU. Algorithms like <b>Round Robin</b> (giving each process a small time slice) and <b>Priority Scheduling</b> aim to ensure fairness and efficiency.</li>
          <li><b>Memory Management:</b> The OS is responsible for allocating and deallocating memory space. Techniques like <b>Paging</b> (dividing memory into fixed-size blocks) and <b>Segmentation</b> are used to manage virtual memory.</li>
          <li><b>Synchronization:</b> When multiple threads or processes access shared resources, their execution must be coordinated to avoid data corruption. <b>Mutexes</b> (locks) and <b>Semaphores</b> are common tools for this.</li>
          <li><b>Deadlock:</b> A critical situation where two or more processes are blocked forever, waiting for each other. The OS must either prevent, avoid, or detect and recover from deadlocks.</li>
        </ul>
      </NoteSection>

      <NoteSection title="Video Tutorials">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/vBURTt97EkA"
              title="Operating Systems Full Course"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/OSXqpsINSlQ"
              title="CPU Scheduling Algorithms"
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
          to={`/technical/modes/Operating Systems`}
          className="inline-block bg-neon-pink text-black font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform animate-glow"
        >
          🚀 Start Test
        </Link>
      </section>
    </div>
  );
}