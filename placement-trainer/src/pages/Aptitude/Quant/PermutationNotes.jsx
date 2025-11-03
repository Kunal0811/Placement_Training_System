// src/pages/Aptitude/Quant/PermutationNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function PermutationNotes() {
  const topic = "Permutation & Combination";
  const videos = [
    { url: "https://www.youtube.com/embed/8VEug2ZpKQo", title: "Permutation & Combination" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="1. Conceptual Overview">
         <ul className="list-disc pl-5 space-y-2">
            <li><b>Permutation: Arrangement.</b> Use this when the order of items matters. (e.g., "arranging" 3 people in 3 chairs).</li>
            <li><b>Combination: Selection.</b> Use this when the order does not matter. (e.g., "choosing" a team of 3 people from 5).</li>
         </ul>
      </NoteSection>
      <NoteSection title="2. Key Concepts & Formulas">
         <ul className="list-disc pl-5 space-y-2">
          <li><b>Factorial (n!):</b> n × (n−1) × ... × 1. (0! = 1).</li>
          <li><b>Permutation (Arrangement):</b> <b>nPr = n! / (n−r)!</b></li>
          <li><b>Combination (Selection):</b> <b>nCr = n! / (r! (n−r)!)</b></li>
          <li><b>Circular Permutations:</b> (n-1)!</li>
        </ul>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}