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

export default function CNNotes() {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto p-6 bg-dark-card rounded-2xl border border-neon-blue/20">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center text-neon-blue hover:text-white transition-colors"
      >
        <span className="text-2xl mr-2">←</span>
        Back
      </button>
      <h1 className="text-5xl font-bold mb-10 text-center text-white text-glow">Computer Networks (CN) Notes</h1>

      <NoteSection title="OSI & TCP/IP Models">
        <p>These models provide a framework for understanding how different networking protocols and devices interact to provide network connectivity.</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li><b>OSI Model (7 Layers):</b> A conceptual model that characterizes the communication functions of a telecommunication or computing system. Layers include Physical, Data Link, Network, Transport, Session, Presentation, and Application.</li>
          <li><b>TCP/IP Model (4 Layers):</b> A more practical model that is used for the internet. Its layers are Network Interface, Internet, Transport, and Application.</li>
        </ul>
      </NoteSection>

      <NoteSection title="Key Protocols">
        <p>Protocols are sets of rules that govern how data is formatted, transmitted, and received.</p>
        <ul className="list-disc pl-6 mt-2 space-y-3">
          <li><b>HTTP/HTTPS:</b> The foundation of the World Wide Web. HTTPS is the secure version, encrypting data between the client and server.</li>
          <li><b>TCP (Transmission Control Protocol):</b> A connection-oriented protocol that provides reliable, ordered, and error-checked delivery of a stream of bytes. Used for web browsing, email, and file transfers.</li>
          <li><b>UDP (User Datagram Protocol):</b> A connectionless protocol that is faster than TCP but does not guarantee delivery. Used for streaming video, online gaming, and DNS.</li>
          <li><b>IP (Internet Protocol):</b> Responsible for addressing and routing packets of data so they can travel across networks and arrive at the correct destination.</li>
          <li><b>DNS (Domain Name System):</b> Translates human-readable domain names (like www.google.com) into machine-readable IP addresses.</li>
        </ul>
      </NoteSection>

      <NoteSection title="Video Tutorials">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/IPvYjXCsTg8"
              title="Computer Networks Full Course"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg border-2 border-neon-blue/30"
              src="https://www.youtube.com/embed/vv4y_uOneC0"
              title="OSI Model Explained"
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
          to={`/technical/modes/Computer Networks`}
          className="inline-block bg-neon-pink text-black font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform animate-glow"
        >
          🚀 Start Test
        </Link>
      </section>
    </div>
  );
} 