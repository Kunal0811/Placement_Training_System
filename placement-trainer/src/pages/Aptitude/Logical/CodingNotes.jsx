// src/pages/Aptitude/Logical/CodingNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function CodingNotes() {
  const topic = "Coding-Decoding";
  const videos = [
    { url: "https://www.youtube.com/embed/0dB6S98Rrko", title: "Coding-Decoding Tricks" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="Conceptual Overview">
        <p>In these questions, a word or message is "coded" in a specific way. You must identify the rule used for coding and apply it to "decode" another word or find the code for a new word.</p>
        <h4 className="text-xl font-semibold text-neon-pink pt-2">Common Patterns</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Letter Shifting:</b> Each letter is moved a fixed number of positions forward or backward (e.g., 'A' becomes 'C', 'B' becomes 'D' is a +2 shift).</li>
          <li><b>Reversing:</b> The word is simply written backward (e.g., 'APPLE' becomes 'ELPPA').</li>
          <li><b>Substitution:</b> Each letter is assigned a different letter or a number (e.g., A=1, B=2...).</li>
        </ul>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}