// src/pages/Aptitude/Quant/PercentagesNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function PercentagesNotes() {
  const topic = "Percentages";
  const videos = [
    { url: "https://www.youtube.com/embed/_TdyTKpNY8g", title: "Percentages Basics" },
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="1. Conceptual Overview">
        <p>A <b>Percentage</b> is a number or ratio expressed as a fraction of 100. It is a fundamental concept used for comparison and is the basis for Profit & Loss, Simple Interest, and Compound Interest.</p>
      </NoteSection>
      <NoteSection title="2. Key Concepts & Formulas">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Convert Fraction to Percent:</b> (a/b) = (a/b × 100)%</li>
          <li><b>Convert Percent to Fraction:</b> x% = x/100</li>
          <li><b>Percentage Increase:</b> ((New Value - Original Value) / Original Value) × 100</li>
          <li><b>Percentage Decrease:</b> ((Original Value - New Value) / Original Value) × 100</li>
          <li>If A is R% more than B, then B is less than A by: (R / (100 + R)) × 100 %</li>
          <li>If A is R% less than B, then B is more than A by: (R / (100 - R)) × 100 %</li>
        </ul>
      </NoteSection>
      <NoteSection title="3. Solved Examples">
        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 1: Basic Percentage</h4>
        <p className="italic"><b>Problem:</b> A student scores 60 marks out of a total of 80. What is their percentage?</p>
        <p><b>Solution:</b><br/>
           Percentage = (Marks Obtained / Total Marks) × 100<br/>
           Percentage = (60 / 80) × 100<br/>
           Percentage = (3 / 4) × 100 = 75%
        </p>
        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 2: Percentage Increase</h4>
        <p className="italic"><b>Problem:</b> A salary of ₹50,000 is increased to ₹60,000. What is the percentage increase?</p>
        <p><b>Solution:</b><br/>
           Increase = 60,000 - 50,000 = 10,000<br/>
           % Increase = (Increase / Original Salary) × 100<br/>
           % Increase = (10,000 / 50,000) × 100 = (1 / 5) × 100 = 20%
        </p>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}