// src/pages/Aptitude/Quant/InterestNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function InterestNotes() {
  const topic = "Simple & Compound Interest";
  const videos = [
    { url: "https://www.youtube.com/embed/3sRZtUczn-8", title: "Simple & Compound Interest" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="1. Conceptual Overview">
        <p><b>Interest</b> is the cost of borrowing money, usually expressed as a percentage rate.</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><b>Simple Interest (SI):</b> Calculated only on the initial principal amount. The interest earned each year is the same.</li>
          <li><b>Compound Interest (CI):</b> Calculated on the principal amount *plus* the accumulated interest from previous periods. It's "interest on interest."</li>
        </ul>
      </NoteSection>
      <NoteSection title="2. Key Concepts & Formulas">
         <ul className="list-disc pl-5 space-y-2">
          <li><b>Simple Interest (SI):</b> SI = (P × R × T) / 100<br/> (P=Principal, R=Rate, T=Time)</li>
          <li><b>Simple Interest Amount (A):</b> A = P + SI</li>
          <li><b>Compound Interest Amount (A):</b> A = P(1 + R/100)<sup>T</sup></li>
          <li><b>Compound Interest (CI):</b> CI = Amount - Principal = P(1 + R/100)<sup>T</sup> - P</li>
          <li><b>Difference between CI and SI for 2 years:</b> P(R/100)²</li>
          <li><b>Difference between CI and SI for 3 years:</b> P(R/100)² (3 + R/100)</li>
        </ul>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}