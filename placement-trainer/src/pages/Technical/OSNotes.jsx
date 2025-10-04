// src/pages/Technical/OSNotes.jsx
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
    </div>
  );
}