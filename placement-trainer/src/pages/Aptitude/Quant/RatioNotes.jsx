// src/pages/Aptitude/Quant/RatioNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function RatioNotes() {
  const topic = "Ratio & Proportion";
  const videos = [
    { url: "https://www.youtube.com/embed/kP7Srz7F5uI", title: "Ratio & Proportion" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="1. Key Concepts & Formulas">
         <ul className="list-disc pl-5 space-y-2">
          <li><b>Ratio:</b> The ratio of a to b is a:b or a/b. It's a comparison of two quantities.</li>
          <li><b>Proportion:</b> An equality of two ratios. If a:b = c:d, we say a, b, c, d are in proportion.</li>
          <li><b>Product of Extremes = Product of Means:</b> If a:b = c:d, then a*d = b*c.</li>
          <li><b>Fourth Proportional:</b> If a:b = c:x, then x = (b*c)/a.</li>
          <li><b>Third Proportional:</b> If a:b = b:x, then x = b²/a.</li>
          <li><b>Mean Proportional:</b> If a:x = x:b, then x = √(a*b).</li>
        </ul>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}