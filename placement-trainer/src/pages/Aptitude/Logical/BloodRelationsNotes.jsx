// src/pages/Aptitude/Logical/BloodRelationsNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function BloodRelationsNotes() {
  const topic = "Blood Relations";
  const videos = [
    { url: "https://www.youtube.com/embed/hzT7z8jrdGg", title: "Blood Relations" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="Conceptual Overview">
        <p>This topic tests your ability to understand family relationships. Problems usually give you a set of relationships and ask you to determine the relation between two specific people.</p>
        <h4 className="text-xl font-semibold text-neon-pink pt-2">Key Relations to Know</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Parents:</b> Mother, Father</li>
          <li><b>Children:</b> Son, Daughter</li>
          <li><b>Siblings:</b> Brother, Sister</li>
          <li><b>Aunt/Uncle:</b> Father's/Mother's sister (Aunt) or brother (Uncle).</li>
          <li><b>Cousin:</b> Child of your aunt or uncle.</li>
        </ul>
        <h4 className="text-xl font-semibold text-neon-pink pt-2">Tips to Solve</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Use a Family Tree:</b> Always draw a diagram. Use squares for males (□), circles for females (○), and lines to connect them.</li>
          <li><b>Don't Assume Gender:</b> A name (like "Alex") is not a reliable indicator of gender unless specified.</li>
        </ul>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}