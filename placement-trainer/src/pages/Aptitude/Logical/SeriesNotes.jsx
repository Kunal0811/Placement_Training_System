// src/pages/Aptitude/Logical/SeriesNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function SeriesNotes() {
  const topic = "Series & Patterns";
  const videos = [
    { url: "https://www.youtube.com/embed/pbqsT8yqFy8", title: "Number Series" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="Conceptual Overview">
        <p>This topic tests your ability to identify the underlying pattern in a given series of numbers or letters and find the missing term.</p>
        <h4 className="text-xl font-semibold text-neon-pink pt-2">Common Patterns</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Arithmetic Progression (AP):</b> Constant difference (e.g., 2, 5, 8, 11, ... here d=3).</li>
          <li><b>Geometric Progression (GP):</b> Constant ratio (e.g., 2, 6, 18, 54, ... here r=3).</li>
          <li><b>Squares/Cubes:</b> Series of n², n³, n²+1, n³-1, etc.</li>
          <li><b>Two-Stage Difference:</b> The *difference between* the differences is constant.</li>
          <li><b>Letter Series:</b> Based on the position of letters in the alphabet.</li>
        </ul>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}