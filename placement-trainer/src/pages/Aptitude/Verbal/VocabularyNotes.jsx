// src/pages/Aptitude/Verbal/VocabularyNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function VocabularyNotes() {
  const topic = "Vocabulary";
  const videos = [
    { url: "https://www.youtube.com/embed/2F07cfZz2xM", title: "Vocabulary Tips" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="Conceptual Overview">
        <p>This tests the breadth of your vocabulary.</p>
         <h4 className="text-xl font-semibold text-neon-pink pt-2">Common Question Types</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Synonyms:</b> Find the word that means the same as the given word.</li>
          <li><b>Antonyms:</b> Find the word that means the opposite of the given word.</li>
          <li><b>Idioms and Phrases:</b> Understand the meaning of common sayings (e.g., "Bite the bullet" means to endure a painful situation).</li>
        </ul>
       </NoteSection>
    </AptitudeNoteLayout>
  );
}