// src/pages/Aptitude/Quant/GeometryNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function GeometryNotes() {
  const topic = "Geometry & Mensuration";
  const videos = [
    { url: "https://youtube.com/embed/DJYQfBuoWvY", title: "Mensuration Formulas" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="Key Formulas">
         <h4 className="text-xl font-semibold text-neon-pink pt-2">2D Shapes</h4>
         <ul className="list-disc pl-5 space-y-2">
          <li><b>Triangle:</b> Area = ½ × base × height</li>
          <li><b>Circle:</b> Area = πr², Circumference = 2πr</li>
          <li><b>Rectangle:</b> Area = length × width, Perimeter = 2(l+w)</li>
          <li><b>Square:</b> Area = side², Perimeter = 4 × side</li>
        </ul>
        <h4 className="text-xl font-semibold text-neon-pink pt-4">3D Shapes</h4>
         <ul className="list-disc pl-5 space-y-2">
          <li><b>Cylinder:</b> Volume = πr²h, Surface Area = 2πrh + 2πr²</li>
          <li><b>Cone:</b> Volume = (1/3)πr²h, Slant Height (l) = √(r² + h²)</li>
          <li><b>Sphere:</b> Volume = (4/3)πr³, Surface Area = 4πr²</li>
        </ul>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}