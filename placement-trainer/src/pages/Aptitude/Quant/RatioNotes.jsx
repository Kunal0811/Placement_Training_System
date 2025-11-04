// src/pages/Aptitude/Quant/RatioNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function RatioNotes() {
  const topic = "Ratio & Proportion";
  const videos = [
    { url: "https://www.youtube.com/embed/kP7Srz7F5uI", title: "Ratio & Proportion - Complete Concept" },
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>

      <NoteSection title="1. Conceptual Overview">
        <p>
          The concept of <b>Ratio & Proportion</b> is used to compare quantities and establish relationships between them.  
          It forms the basis for solving problems in mixtures, partnerships, and variations.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><b>Ratio:</b> A comparison of two similar quantities. The ratio of a to b is written as a:b or a/b.</li>
          <li><b>Proportion:</b> When two ratios are equal, we say they are in proportion.  
              If a:b = c:d, then a, b, c, d are in proportion.</li>
        </ul>
        <p className="mt-2 italic">Example: If 2 pens cost ₹10 and 4 pens cost ₹20,  
        the ratio 2:10 = 4:20 → they are in proportion.</p>
      </NoteSection>

      <NoteSection title="2. Key Concepts & Formulas">
         <ul className="list-disc pl-5 space-y-2">
          <li><b>Ratio:</b> a:b = a/b</li>
          <li><b>Proportion:</b> a:b = c:d  ⇒  a×d = b×c (Product of Extremes = Product of Means)</li>
          <li><b>Fourth Proportional:</b> If a:b = c:x, then x = (b×c)/a</li>
          <li><b>Third Proportional:</b> If a:b = b:x, then x = (b²)/a</li>
          <li><b>Mean Proportional:</b> If a:x = x:b, then x = √(a×b)</li>
          <li><b>Compound Ratio:</b> If a:b and c:d, compound ratio = (a×c):(b×d)</li>
        </ul>
      </NoteSection>

      <NoteSection title="3. Important Properties">
        <ul className="list-disc pl-5 space-y-2">
          <li>If a:b = c:d, then (a + b):(c + d) is also the same ratio if both are added in equal proportion.</li>
          <li>Multiplying or dividing both terms of a ratio by the same number doesn’t change the ratio.</li>
          <li>If a/b = c/d = e/f, then each is equal to a constant called the <b>common ratio</b>.</li>
          <li>Ratios have no units since they are a comparison of similar quantities.</li>
        </ul>
      </NoteSection>

      <NoteSection title="4. Solved Examples">
        <h4 className="text-lg font-semibold text-neon-pink">Example 1: Simplifying a Ratio</h4>
        <p className="italic"><b>Problem:</b> Find the simplest form of 300 ml : 1.5 liters.</p>
        <p><b>Solution:</b><br/>
          Convert to same unit → 1.5 liters = 1500 ml<br/>
          Ratio = 300 : 1500 = 1 : 5
        </p>

        <h4 className="text-lg font-semibold text-neon-pink pt-3">Example 2: Finding Fourth Proportional</h4>
        <p className="italic"><b>Problem:</b> Find the fourth proportional to 3, 6, 12.</p>
        <p><b>Solution:</b><br/>
          a:b = c:x ⇒ x = (b×c)/a = (6×12)/3 = 24
        </p>

        <h4 className="text-lg font-semibold text-neon-pink pt-3">Example 3: Mean Proportional</h4>
        <p className="italic"><b>Problem:</b> Find the mean proportional between 9 and 16.</p>
        <p><b>Solution:</b><br/>
          x = √(a×b) = √(9×16) = √144 = 12
        </p>

        <h4 className="text-lg font-semibold text-neon-pink pt-3">Example 4: Ratio Division</h4>
        <p className="italic"><b>Problem:</b> ₹1200 is divided between A and B in the ratio 2:3. Find each share.</p>
        <p><b>Solution:</b><br/>
          Total parts = 2 + 3 = 5<br/>
          A’s share = (2/5) × 1200 = ₹480<br/>
          B’s share = (3/5) × 1200 = ₹720
        </p>

        <h4 className="text-lg font-semibold text-neon-pink pt-3">Example 5: Proportion Check</h4>
        <p className="italic"><b>Problem:</b> Check whether 6, 8, 9, 12 are in proportion.</p>
        <p><b>Solution:</b><br/>
          6:8 = 3:4, and 9:12 = 3:4 → Yes, they are in proportion.
        </p>
      </NoteSection>

      <NoteSection title="5. Shortcut Tricks & Tips">
        <ul className="list-disc pl-5 space-y-2">
          <li>To compare ratios like 2:3 and 3:5 → cross-multiply (2×5 vs 3×3) → 10 vs 9 → 2:3 is greater.</li>
          <li>When dividing an amount in a given ratio, always add the ratio parts first.</li>
          <li>To find the missing term in proportion quickly: use <b>x = (b×c)/a</b>.</li>
          <li>Always convert units before forming ratios (e.g., grams to kilograms, hours to minutes).</li>
        </ul>
      </NoteSection>

      <NoteSection title="6. Real-Life Applications">
        <p>
          - Used in business (profit sharing, mixing ingredients, currency exchange).<br/>
          - Used in maps and models for scaling.<br/>
          - Common in mixture, partnership, and speed problems.
        </p>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}
