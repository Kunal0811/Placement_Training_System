// src/pages/Aptitude/Logical/DirectionSenseNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function DirectionSenseNotes() {
  const topic = "Direction Sense";
  const videos = [
    { url: "https://www.youtube.com/embed/AX9aUQW9fD8", title: "Direction Sense Tricks" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="Conceptual Overview">
        <p>These questions test your ability to track direction and distance. You are given a person's movement (e.g., "walks 10m North, then 5m East") and must find their final position relative to the start.</p>
        <h4 className="text-xl font-semibold text-neon-pink pt-2">Key Concepts</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>4 Cardinal Directions:</b> North, South, East, West.</li>
          <li><b>4 Ordinal Directions:</b> North-East, North-West, South-East, South-West.</li>
          <li><b>Turns:</b> A "right turn" is a 90-degree clockwise turn. A "left turn" is 90-degree anti-clockwise.</li>
          <li><b>Pythagoras Theorem:</b> Used to find the shortest distance (hypotenuse) between the start and end point. a² + b² = c²</li>
        </ul>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}