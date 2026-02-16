// src/pages/Aptitude/AptitudeNoteLayout.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

// This is the main layout for all aptitude note pages
export const NoteSection = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-3xl font-bold mb-4 text-neon-blue text-glow">{title}</h2>
    <div className="space-y-4 text-gray-300 leading-relaxed">
      {children}
    </div>
  </section>
);

export const AptitudeNoteLayout = ({ title, children, topic, videos = [] }) => {
  const navigate = useNavigate(); // Get navigate function

  return (
    <div className="max-w-5xl mx-auto p-8 bg-dark-card rounded-2xl border border-neon-blue/20">
      
      {/* --- ADDED BACK BUTTON --- */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center text-neon-blue hover:text-white transition-colors"
      >
        <span className="text-2xl mr-2">←</span>
        Back
      </button>
      {/* --- END OF ADDED BUTTON --- */}

      <h1 className="text-5xl font-bold mb-10 text-center text-white text-glow">{title}</h1>
      
      {children}

      {videos.length > 0 && (
        <NoteSection title="Video Tutorials">
          <div className="grid md:grid-cols-2 gap-6">
            {videos.map((video, vIdx) => (
              <div key={vIdx} className="aspect-video">
                <iframe
                  className="w-full h-full rounded-lg border-2 border-neon-blue/30"
                  src={video.url}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </NoteSection>
      )}

      <section className="mt-12 pt-8 border-t-2 border-dashed border-neon-pink/20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-neon-pink text-glow">Practice Test</h2>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          Ready to test your knowledge on {topic}?
        </p>
        <Link
          to={`/aptitude/modes/${encodeURIComponent(topic)}`}
          className="inline-block bg-neon-blue text-black font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform border-neon-blue shadow-lg hover:shadow-neon-blue/50"
        >
          🚀 Start Test
        </Link>
      </section>
    </div>
  );
};