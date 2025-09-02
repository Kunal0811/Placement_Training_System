import React from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "Quantitative Aptitude",
    desc: "Covers arithmetic, algebra, geometry, probability, and statistics.",
    details: ["25+ Topics", "1000+ Practice Questions", "Step-by-step Solutions"],
    icon: "🧮",
  },
  {
    title: "Logical Reasoning",
    desc: "Practice puzzles, seating arrangements, blood relations, and coding-decoding.",
    details: ["20+ Types of Puzzles", "Timed Tests", "Explanations & Tricks"],
    icon: "🧠",
  },
  {
    title: "Verbal Ability",
    desc: "Enhance grammar, vocabulary, comprehension, and communication skills.",
    details: ["Grammar Rules", "Reading Comprehension", "Synonyms & Antonyms"],
    icon: "📖",
  },
];

export default function Aptitude() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">
        Aptitude Module
      </h1>
      <p className="mb-10 text-center text-lg text-gray-700 max-w-2xl mx-auto">
        Sharpen your problem-solving and analytical thinking with our structured
        aptitude modules. Each section is designed with <b>topic-wise notes,
        practice questions, and real exam-style tests</b> to make your prep
        effective.
      </p>

      <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((sec) => (
          <li key={sec.title} className="h-full">
            <Link
              to={`/aptitude/notes/${encodeURIComponent(sec.title)}`}
              className="group relative flex flex-col justify-between h-full bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-2 border border-gray-200"
            >
              {/* Gradient border animation */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition duration-500 blur-md"></div>
              <div className="relative z-10 flex flex-col h-full text-center">
                <div className="text-5xl mb-4">{sec.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {sec.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{sec.desc}</p>
                <div className="text-sm text-gray-700 space-y-1">
                  {sec.details.map((d, i) => (
                    <div key={i}>• {d}</div>
                  ))}
                </div>
                <span className="mt-4 inline-block text-blue-600 font-medium group-hover:underline">
                  Explore →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
