// src/pages/Technical.jsx
import { Link } from "react-router-dom";

const technicalModules = [
  { name: "C Programming Notes", path: "cnotes" },
  { name: "C++ Programming Notes", path: "cpp" },
  { name: "Java Programming Notes", path: "java" },
  { name: "Python Programming Notes", path: "python" },
  { name: "DSA Notes", path: "dsa" },
  { name: "DBMS Notes", path: "dbms" },
  { name: "OS Notes", path: "os" },
  { name: "CN Notes", path: "cn" },
];

export default function Technical() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">
        Technical Module
      </h1>
      <p className="mb-10 text-center text-lg text-gray-700 max-w-2xl mx-auto">
        The Technical Module covers core subjects essential for placement preparation. 
        You’ll find programming notes, database concepts, operating systems, computer 
        networks, and data structures & algorithms. Each section is designed to help 
        you strengthen your fundamentals and practice key concepts frequently asked 
        in interviews and exams.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {technicalModules.map((module, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-yellow-200 to-pink-300 
                      p-6 rounded-lg shadow hover:scale-105 transform transition
                      h-40 flex flex-col justify-between"
          >
            <h2 className="text-lg font-semibold">{module.name}</h2>
            <Link
              to={module.path}
              className="text-blue-600 hover:underline font-medium mt-2"
            >
              Learn →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}