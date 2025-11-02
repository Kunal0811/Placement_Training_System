
// src/pages/Aptitude/AptitudeNotes.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const syllabus = [
  {
    title: "Quantitative Aptitude",
    sections: [
      {
        subtitle: "Number System",
        notes: [
          "Types of numbers: Natural, Whole, Integers, Rational, Irrational, Prime, Composite.",
          "HCF × LCM = Product of two numbers.",
          "Sum of first n natural numbers: n(n+1)/2.",
          "Sum of first n squares: n(n+1)(2n+1)/6.",
          "Divisibility Rules: 2,3,4,5,6,8,9,11.",
          "Shortcut for divisibility by 11: (Sum of digits at odd positions − sum at even positions) is divisible by 11.",
        ],
        videos: [
          "https://youtube.com/embed/qlEvy3pgmKU",
          "https://youtube.com/embed/UKXCnwWSZEI",
        ],
      },
      {
        subtitle: "Percentages",
        notes: [
          "Percentage formula: (Value / Total) × 100.",
          "1% of a number = number ÷ 100.",
          "5% of a number = number ÷ 20.",
          "Successive percentage changes multiply: (1 ± p1/100)(1 ± p2/100) ... − 1",
        ],
        videos: [
          "https://www.youtube.com/embed/_TdyTKpNY8g",
        ],
      },
      {
        subtitle: "Profit & Loss",
        notes: [
          "Profit = Selling Price − Cost Price",
          "Loss = Cost Price − Selling Price",
          "Profit % = (Profit / Cost Price) × 100",
          "Loss % = (Loss / Cost Price) × 100",
          "Marked Price = Cost Price + Profit",
        ],
        videos: [
          "https://youtube.com/embed/_cW7_BUDYcw",
        ],
      },
      {
        subtitle: "Simple & Compound Interest",
        notes: [
          "Simple Interest (SI) = (P × R × T) / 100",
          "Compound Interest (CI) = P(1 + R/100)^T − P",
          "For 2 years CI, add (R²/100) to SI.",
          "CI is calculated annually/half-yearly/quarterly based on rate divisions.",
        ],
        videos: [
          "https://www.youtube.com/embed/3sRZtUczn-8",
        ],
      },
      {
        subtitle: "Time, Speed & Distance",
        notes: [
          "Speed = Distance / Time",
          "Distance = Speed × Time",
          "Time = Distance / Speed",
          "Relative speed in same direction = |V1 − V2|",
          "Relative speed in opposite direction = V1 + V2",
        ],
        videos: [
          "https://www.youtube.com/embed/vN7eJw-1MSM",
        ],
      },
      {
        subtitle: "Ratio & Proportion",
        notes: [
          "Ratio = a : b",
          "If a/b = c/d then ad = bc",
          "Divide quantity in ratio m:n → parts = m+n",
          "Each part = total quantity / parts",
        ],
        videos: [
          "https://www.youtube.com/embed/kP7Srz7F5uI",
        ],
      },
      {
        subtitle: "Permutation & Combination",
        notes: [
          "Permutation: nPr = n! / (n−r)!",
          "Combination: nCr = n! / (r! (n−r)!)",
          "Factorial (n!) = n × (n−1) × ... × 1",
        ],
        videos: [
          "https://www.youtube.com/embed/8VEug2ZpKQo",
        ],
      },
      {
        subtitle: "Geometry & Mensuration",
        notes: [
          "Triangle area = ½ × base × height",
          "Circle area = πr², Circumference = 2πr",
          "Volume of cylinder = πr²h",
          "Volume of cone = (1/3)πr²h",
          "Volume of sphere = (4/3)πr³",
        ],
        videos: [
          "https://www.youtube.com/embed/DJYQfBuoWvY",
        ],
      },
    ],
  },
  {
    title: "Logical Reasoning",
    sections: [
      {
        subtitle: "Series & Patterns",
        notes: [
          "Number series: Arithmetic, Geometric progressions",
          "Letter series: Alphabet shifting",
          "Odd one out: Identify the item not following the pattern",
        ],
        videos: [
          "https://www.youtube.com/embed/pbqsT8yqFy8",
        ],
      },
      {
        subtitle: "Coding-Decoding",
        notes: [
          "Substitution methods: letters replaced systematically",
          "Letter shifting: forward or backward by fixed positions",
        ],
        videos: [
          "https://www.youtube.com/embed/0dB6S98Rrko",
        ],
      },
      {
        subtitle: "Blood Relations",
        notes: [
          "Father, mother, son, daughter, brother, sister relations",
          "Practice diagrammatic representation",
        ],
        videos: [
          "https://www.youtube.com/embed/hzT7z8jrdGg",
        ],
      },
      {
        subtitle: "Direction Sense",
        notes: [
          "North, South, East, West basics",
          "Right turn = 90° clockwise, Left turn = 90° anticlockwise",
          "Relative direction calculation",
        ],
        videos: [
          "https://www.youtube.com/embed/AX9aUQW9fD8",
        ],
      },
    ],
  },
  {
    title: "Verbal Ability",
    sections: [
      {
        subtitle: "Grammar",
        notes: [
          "Parts of Speech: Noun, Pronoun, Verb, Adjective, Adverb, Preposition, Conjunction, Interjection",
          "Tenses: Present, Past, Future (Simple, Continuous, Perfect)",
          "Subject-Verb Agreement rules",
          "Active and Passive voice conversion",
          "Direct and Indirect speech rules",
        ],
        videos: [
          "https://www.youtube.com/embed/0nBAQeUph1w",
        ],
      },
      {
        subtitle: "Vocabulary",
        notes: [
          "Synonyms and Antonyms",
          "One word substitution",
          "Idioms and phrases",
        ],
        videos: [
          "https://www.youtube.com/embed/2F07cfZz2xM",
        ],
      },
      {
        subtitle: "Reading Comprehension",
        notes: [
          "Practice passage reading",
          "Identify main idea, tone, inference",
        ],
        videos: [
          "https://www.youtube.com/embed/TbQp4ij0T44",
        ],
      },
    ],
  },
];

export default function AptitudeNotes({ section }) {
  const [open, setOpen] = useState({});

  const toggle = (sIdx, tIdx) => {
    const key = `${sIdx}-${tIdx}`;
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredSyllabus = section
    ? syllabus.filter((s) => s.title === section)
    : syllabus;

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <h1 className="text-5xl font-bold text-center mb-10 text-white text-glow">
        Aptitude Notes - {section || "Complete Syllabus"}
      </h1>

      {filteredSyllabus.map((section, sIdx) => (
        <div key={sIdx} className="mb-10">
          <h2 className="text-4xl font-semibold mb-6 border-b-2 border-neon-blue/30 pb-3 text-neon-blue text-glow">
            
          </h2>

          {section.sections.map((topic, tIdx) => {
            const key = `${sIdx}-${tIdx}`;
            const isOpen = open[key];

            return (
              <div key={tIdx} className="bg-dark-card rounded-lg shadow mb-3 overflow-hidden border border-gray-700/50">
                <button
                  onClick={() => toggle(sIdx, tIdx)}
                  className="flex justify-between items-center w-full px-5 py-4 text-left text-lg font-medium text-white hover:bg-neon-blue/10"
                >
                  <span>{topic.subtitle}</span>
                  <span className={`text-2xl font-bold transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-8 py-5 bg-dark-bg/50 space-y-5 border-t border-neon-blue/20">
                    {/* Notes */}
                    <ul className="list-disc space-y-2 text-gray-300 pl-5">
                      {topic.notes.map((note, nIdx) => (
                        <li key={nIdx}>{note}</li>
                      ))}
                    </ul>

                    {/* Videos */}
                    {topic.videos && (
                      <div className="grid md:grid-cols-2 gap-4 pt-4">
                        {topic.videos.map((video, vIdx) => (
                          <div key={vIdx} className="aspect-video">
                            <iframe
                              src={video}
                              title={`Video ${vIdx}`}
                              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                              allowFullScreen
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Start Test Button */}
                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                      <Link
                        to={`/aptitude/modes/${encodeURIComponent(topic.subtitle)}`}
                        className="inline-block bg-neon-green text-black font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform animate-glow"
                      >
                        🚀 Start Test
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}