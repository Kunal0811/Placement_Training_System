// src/pages/Aptitude/Quant/PermutationNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function PermutationNotes() {
  const topic = "Permutation & Combination";
  const videos = [
    { url: "https://www.youtube.com/embed/8VEug2ZpKQo", title: "Permutation & Combination - Complete Concept" },
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>

      <NoteSection title="1. Conceptual Overview">
        <p>
          The concept of <b>Permutation & Combination</b> deals with the different ways of arranging or selecting items from a set.  
          It is an important topic in probability and counting principles.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><b>Permutation:</b> Refers to the <u>arrangement</u> of objects. Order matters.<br/>
            Example: Arranging 3 students A, B, C → ABC, ACB, BAC, BCA, CAB, CBA → total 6 arrangements.
          </li>
          <li><b>Combination:</b> Refers to the <u>selection</u> of objects. Order doesn’t matter.<br/>
            Example: Choosing 2 students from A, B, C → AB, AC, BC → only 3 ways.
          </li>
        </ul>
      </NoteSection>

      <NoteSection title="2. Key Concepts & Formulas">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Factorial (n!):</b> n! = n × (n−1) × (n−2) × ... × 1; by definition, 0! = 1.</li>
          <li><b>Permutation Formula:</b> nPr = n! / (n−r)!  
            <br/><i>Used when order matters.</i>
          </li>
          <li><b>Combination Formula:</b> nCr = n! / [r! × (n−r)!]  
            <br/><i>Used when order doesn’t matter.</i>
          </li>
          <li><b>Relation Between nPr and nCr:</b> nPr = nCr × r!</li>
          <li><b>Circular Permutation:</b> (n−1)! arrangements for n distinct items arranged in a circle.</li>
          <li><b>Permutation of n items where some items repeat:</b> n! / (p! × q! × r! ...)</li>
        </ul>
      </NoteSection>

      <NoteSection title="3. Differences Between Permutation & Combination">
        <table className="border border-gray-400 text-sm w-full text-left mt-3">
          <thead>
            <tr className="bg-gray-700 border-b">
              <th className="border p-2">Aspect</th>
              <th className="border p-2">Permutation</th>
              <th className="border p-2">Combination</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="border p-2">Meaning</td>
              <td className="border p-2">Arrangement of objects</td>
              <td className="border p-2">Selection of objects</td>
            </tr>
            <tr className="border-b">
              <td className="border p-2">Order</td>
              <td className="border p-2">Matters</td>
              <td className="border p-2">Does not matter</td>
            </tr>
            <tr className="border-b">
              <td className="border p-2">Formula</td>
              <td className="border p-2">nPr = n! / (n−r)!</td>
              <td className="border p-2">nCr = n! / [r! (n−r)!]</td>
            </tr>
            <tr>
              <td className="border p-2">Example</td>
              <td className="border p-2">Arranging 3 letters (ABC, ACB, BAC...)</td>
              <td className="border p-2">Choosing 3 letters (ABC only once)</td>
            </tr>
          </tbody>
        </table>
      </NoteSection>

      <NoteSection title="4. Solved Examples">
        <h4 className="text-lg font-semibold text-neon-pink">Example 1: Basic Permutation</h4>
        <p className="italic"><b>Problem:</b> How many ways can 3 letters be arranged from the word “MATH”?</p>
        <p><b>Solution:</b><br/>
          n = 4, r = 3<br/>
          nPr = 4! / (4−3)! = 24 / 1 = 24 ways.
        </p>

        <h4 className="text-lg font-semibold text-neon-pink pt-3">Example 2: Basic Combination</h4>
        <p className="italic"><b>Problem:</b> How many ways can 3 students be chosen from a group of 6?</p>
        <p><b>Solution:</b><br/>
          n = 6, r = 3<br/>
          nCr = 6! / [3!(6−3)!] = 720 / (6×6) = 20 ways.
        </p>

        <h4 className="text-lg font-semibold text-neon-pink pt-3">Example 3: Circular Permutation</h4>
        <p className="italic"><b>Problem:</b> In how many ways can 5 friends sit around a circular table?</p>
        <p><b>Solution:</b><br/>
          Circular arrangements = (n−1)! = (5−1)! = 4! = 24 ways.
        </p>

        <h4 className="text-lg font-semibold text-neon-pink pt-3">Example 4: Repetition Case</h4>
        <p className="italic"><b>Problem:</b> How many distinct words can be formed using all letters of “BALLOON”?</p>
        <p><b>Solution:</b><br/>
          Total letters = 7 (B-1, A-1, L-2, O-2, N-1)<br/>
          Total arrangements = 7! / (2! × 2!) = 5040 / 4 = 1260 ways.
        </p>
      </NoteSection>

      <NoteSection title="5. Shortcut Tricks & Tips">
        <ul className="list-disc pl-5 space-y-2">
          <li>Whenever order matters → use <b>Permutation</b>.</li>
          <li>Whenever order doesn’t matter → use <b>Combination</b>.</li>
          <li>For selection + arrangement, multiply both: Example – selecting 3 out of 5 (5C3) and arranging them (3!) → 5C3 × 3! = 5P3.</li>
          <li>For circular arrangements, (n−1)! is used only if rotation is considered same.</li>
        </ul>
      </NoteSection>

      <NoteSection title="6. Real-Life Applications">
        <p>
          - Arranging seats, books, or people (Permutation).<br/>
          - Selecting teams, committees, or lottery numbers (Combination).<br/>
          - Foundation for probability problems and counting-based reasoning.
        </p>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}
