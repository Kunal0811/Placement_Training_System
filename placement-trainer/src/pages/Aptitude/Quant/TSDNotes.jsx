// src/pages/Aptitude/Quant/TSDNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function TSDNotes() {
  const topic = "Time, Speed & Distance";
  const videos = [
    { url: "https://www.youtube.com/embed/vN7eJw-1MSM", title: "Time, Speed & Distance" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="1. Key Concepts & Formulas">
         <ul className="list-disc pl-5 space-y-2">
          <li><b>Speed =</b> Distance / Time</li>
          <li><b>Time =</b> Distance / Speed</li>
          <li><b>Distance =</b> Speed × Time</li>
          <li><b>To convert km/hr to m/s:</b> multiply by 5/18</li>
          <li><b>To convert m/s to km/hr:</b> multiply by 18/5</li>
          <li><b>Average Speed:</b> Total Distance / Total Time.</li>
          <li><b>For same distance (x, y speeds):</b> Average Speed = (2xy) / (x+y)</li>
          <li><b>Relative Speed (Opposite):</b> s1 + s2</li>
          <li><b>Relative Speed (Same):</b> |s1 - s2|</li>
        </ul>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}
