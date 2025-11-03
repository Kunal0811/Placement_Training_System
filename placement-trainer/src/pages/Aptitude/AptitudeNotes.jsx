// src/pages/Aptitude/AptitudeNotes.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import API_BASE from "../../api";

// --- UPDATED: We removed the static 'notes' array ---
const syllabus = [
  {
    title: "Quantitative Aptitude",
    sections: [
      {
        subtitle: "Number System",
        videos: [
          "https://youtube.com/embed/qlEvy3pgmKU",
          "https://youtube.com/embed/UKXCnwWSZEI",
        ],
      },
      {
        subtitle: "Percentages",
        videos: [
          "https://www.youtube.com/embed/_TdyTKpNY8g",
        ],
      },
      {
        subtitle: "Profit & Loss",
        videos: [
          "https://youtube.com/embed/_cW7_BUDYcw",
        ],
      },
      {
        subtitle: "Simple & Compound Interest",
        videos: [
          "https://www.youtube.com/embed/3sRZtUczn-8",
        ],
      },
      {
        subtitle: "Time, Speed & Distance",
        videos: [
          "https://www.youtube.com/embed/vN7eJw-1MSM",
        ],
      },
      {
        subtitle: "Ratio & Proportion",
        videos: [
          "https://www.youtube.com/embed/kP7Srz7F5uI",
        ],
      },
      {
        subtitle: "Permutation & Combination",
        videos: [
          "https://www.youtube.com/embed/8VEug2ZpKQo",
        ],
      },
      {
        subtitle: "Geometry & Mensuration",
        videos: [
          "https://youtube.com/embed/DJYQfBuoWvY",
        ],
      },
    ],
  },
  {
    title: "Logical Reasoning",
    sections: [
      {
        subtitle: "Series & Patterns",
        videos: [
          "https://www.youtube.com/embed/pbqsT8yqFy8",
        ],
      },
      {
        subtitle: "Coding-Decoding",
        videos: [
          "https://www.youtube.com/embed/0dB6S98Rrko",
        ],
      },
      {
        subtitle: "Blood Relations",
        videos: [
          "https://www.youtube.com/embed/hzT7z8jrdGg",
        ],
      },
      {
        subtitle: "Direction Sense",
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
        videos: [
          "https://www.youtube.com/embed/0nBAQeUph1w",
        ],
      },
      {
        subtitle: "Vocabulary",
        videos: [
          "https://www.youtube.com/embed/2F07cfZz2xM",
        ],
      },
      {
        subtitle: "Reading Comprehension",
        videos: [
          "https://www.youtube.com/embed/TbQp4ij0T44",
        ],
      },
    ],
  },
];


// --- NEW, MORE ROBUST MarkdownRenderer ---
const MarkdownRenderer = ({ text }) => {
  if (!text) return null;

  const renderLine = (line) => {
    // This regex splits the line by **bold text** or *italic text*
    // while keeping the delimiters.
    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);

    return parts.map((part, i) => {
      // --- Handle Bold (`**text**`) ---
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.substring(2, part.length - 2)}</strong>;
      }
      // --- Handle Italic (`*text*`) ---
      // Also treats the AI's mistake (*text:**) as bold
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={i}>{part.substring(1, part.length - 1)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith(':**')) {
         return <strong key={i}>{part.substring(1, part.length - 3)}:</strong>
      }
      return <span key={i}>{part}</span>;
    });
  };

  const lines = text.split('\n');

  return (
    <div className="space-y-3 text-gray-300">
      {lines.map((line, index) => {
        // --- Handle Headings ---
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-4xl font-bold text-white text-glow pt-6">{renderLine(line.substring(2))}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-3xl font-bold text-neon-pink text-glow pt-6">{renderLine(line.substring(3))}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-2xl font-semibold text-neon-blue text-glow pt-4">{renderLine(line.substring(4))}</h3>;
        }
        if (line.startsWith('#### ')) {
          return <h4 key={index} className="text-xl font-semibold text-neon-pink pt-2">{renderLine(line.substring(5))}</h4>;
        }

        // --- Handle Bullet Points ---
        if (line.trim().startsWith('* ')) {
          return <li key={index} className="list-disc ml-6">{renderLine(line.trim().substring(2))}</li>;
        }
        
        // --- Handle Numbered Lists ---
        if (line.trim().match(/^\d+\.\s/)) {
            return <li key={index} className="list-decimal ml-6">{renderLine(line.trim().substring(line.indexOf(' ') + 1))}</li>;
        }

        // --- Handle Dividers ---
        if (line.trim() === '---') {
          return <hr key={index} className="border-neon-blue/20 my-4" />;
        }

        // --- Handle Empty Lines (as vertical space) ---
        if (line.trim() === '') {
            return <div key={index} className="h-2"></div>;
        }

        // --- Default Paragraph ---
        return (
          <p key={index}>
            {renderLine(line)}
          </p>
        );
      })}
    </div>
  );
};
// --- END NEW MarkdownRenderer ---


export default function AptitudeNotes({ section }) {
  const [open, setOpen] = useState({});
  const [noteContent, setNoteContent] = useState({});
  const [loadingTopic, setLoadingTopic] = useState("");

  const fetchNotes = async (topic) => {
    if (noteContent[topic]) return; // Already fetched
    
    setLoadingTopic(topic);
    try {
      const res = await fetch(`${API_BASE}/api/aptitude/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to fetch notes");
      }
      setNoteContent((prev) => ({ ...prev, [topic]: data.notes }));
    } catch (err) {
      console.error("Note fetch failed:", err);
      setNoteContent((prev) => ({ ...prev, [topic]: "Error loading notes." }));
    } finally {
      setLoadingTopic("");
    }
  };
  
  const toggle = (sIdx, tIdx, topicSubtitle) => {
    const key = `${sIdx}-${tIdx}`;
    const isOpen = !open[key];
    setOpen((prev) => ({ ...prev, [key]: isOpen }));
    
    if (isOpen) {
      fetchNotes(topicSubtitle);
    }
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
            {section.title}
          </h2>

          {section.sections.map((topic, tIdx) => {
            const key = `${sIdx}-${tIdx}`;
            const isOpen = open[key];
            const isLoading = loadingTopic === topic.subtitle;
            const notes = noteContent[topic.subtitle];

            return (
              <div key={tIdx} className="bg-dark-card rounded-lg shadow mb-3 overflow-hidden border border-gray-700/50">
                <button
                  onClick={() => toggle(sIdx, tIdx, topic.subtitle)}
                  className="flex justify-between items-center w-full px-5 py-4 text-left text-lg font-medium text-white hover:bg-neon-blue/10"
                >
                  <span>{topic.subtitle}</span>
                  <span className={`text-2xl font-bold transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-8 py-5 bg-dark-bg/50 border-t border-neon-blue/20">
                    {isLoading && (
                      <div className="flex justify-center items-center h-48">
                        <div className="animate-spin text-4xl">⚙️</div>
                        <p className="ml-4 text-lg text-gray-400">Loading AI-generated notes...</p>
                      </div>
                    )}
                    
                    {!isLoading && notes && (
                       <div className="grid lg:grid-cols-2 gap-8">
                        {/* Column 1: AI-Generated Notes */}
                        <div className="max-w-none">
                           <MarkdownRenderer text={notes} />
                        </div>
                        
                        {/* Column 2: Videos & Test Button */}
                        <div className="space-y-6">
                          {topic.videos && (
                            <div className="space-y-4">
                              {topic.videos.map((video, vIdx) => (
                                <div key={vIdx} className="aspect-video">
                                  <iframe
                                    src={video}
                                    title={`Video ${vIdx}`}
                                    className="w-full h-full rounded-lg border-2 border-neon-blue/30"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                                    allowFullScreen
                                  />
                                  {/* --- THIS IS THE LINE WITH THE TYPO --- */}
                                  {/* --- I have removed the stray 'D;' --- */}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="mt-4 pt-4 border-t border-gray-700/50">
                            <Link
                              to={`/aptitude/modes/${encodeURIComponent(topic.subtitle)}`}
                              className="inline-block bg-neon-green text-black font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform animate-glow"
                            >
                              🚀 Start Test
                            </Link>
                          </div>
                        </div>
                       </div>
                    )}
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