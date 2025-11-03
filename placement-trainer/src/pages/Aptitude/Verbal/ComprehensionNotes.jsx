// src/pages/Aptitude/Verbal/ComprehensionNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function ComprehensionNotes() {
  const topic = "Reading Comprehension";
  const videos = [
    { url: "https://www.youtube.com/embed/TbQp4ij0T44", title: "Reading Comprehension" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="Conceptual Overview">
        <p>You will be given a passage of text and asked questions based on it. This tests your ability to read and understand information quickly and accurately.</p>
        <h4 className="text-xl font-semibold text-neon-pink pt-2">Tips to Improve</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Read the Questions First:</b> This helps you know what to look for while reading the passage.</li>
          <li><b>Identify the Main Idea:</b> What is the central point the author is trying to make?</li>
          <li><b>Inference vs. Fact:</b> Understand the difference between what is *directly stated* in the text and what is *implied* by it.</li>
        </ul>
       </NoteSection>
    </AptitudeNoteLayout>
  );
}