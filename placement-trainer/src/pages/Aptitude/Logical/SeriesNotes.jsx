// src/pages/Aptitude/Logical/SeriesNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function SeriesNotes() {
  const topic = "Series & Patterns";
  const videos = [
    { url: "https://www.youtube.com/embed/pbqsT8yqFy8", title: "Number Series Tricks & Patterns" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      
      {/* 1. Conceptual Overview */}
      <NoteSection title="1. Conceptual Overview">
        <p>
          The <b>Series & Patterns</b> topic checks your logical thinking and ability to identify 
          sequences in numbers, letters, or symbols. The key idea is to detect 
          the rule governing the pattern and predict the next or missing element.
        </p>
        <h4 className="text-lg font-semibold text-neon-pink pt-3">Common Series Types</h4>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><b>Arithmetic Progression (AP):</b> Constant difference between terms.<br/>Example: 3, 6, 9, 12, 15 → Common Difference = +3</li>
          <li><b>Geometric Progression (GP):</b> Constant ratio between terms.<br/>Example: 2, 4, 8, 16 → Common Ratio = ×2</li>
          <li><b>Squares/Cubes:</b> Terms are squares or cubes of consecutive numbers.<br/>Example: 1, 4, 9, 16, 25 or 1, 8, 27, 64...</li>
          <li><b>Alternating Patterns:</b> Two or more sequences alternate.<br/>Example: 2, 4, 8, 3, 6, 12 → two interlaced series.</li>
          <li><b>Mixed Operations:</b> Pattern involves +, −, ×, ÷ combinations.<br/>Example: 2, 5, 10, 17, 26 → (+3, +5, +7, +9)</li>
          <li><b>Letter Series:</b> Based on the position of letters in the alphabet.<br/>Example: A, C, E, G, I → +2 each time.</li>
        </ul>
      </NoteSection>

      {/* 2. Types of Series */}
      <NoteSection title="2. Types of Series Questions">
        <h4 className="text-lg font-semibold text-neon-pink mt-2">A. Number Series</h4>
        <p>Identify a mathematical pattern among numbers.</p>
        <p><b>Example:</b> 5, 10, 20, 40, ? → Multiply by 2 → Answer: 80</p>

        <h4 className="text-lg font-semibold text-neon-pink mt-3">B. Alphabet Series</h4>
        <p>Each term represents an alphabetic position.</p>
        <p><b>Example:</b> A, D, G, J, ? → +3 → Answer: M</p>

        <h4 className="text-lg font-semibold text-neon-pink mt-3">C. Alphanumeric Series</h4>
        <p>Combination of numbers and letters with a hidden logic.</p>
        <p><b>Example:</b> A1, B4, C9, D16, ? → Square of positions → E25</p>

        <h4 className="text-lg font-semibold text-neon-pink mt-3">D. Mixed Series</h4>
        <p>Pattern may alternate between two or more rules.</p>
        <p><b>Example:</b> 1, 4, 9, 16, 25, 36 → (n² series)</p>
      </NoteSection>

      {/* 3. Solved Examples */}
      <NoteSection title="3. Solved Examples">
        <h4 className="text-lg font-semibold text-neon-pink mt-2">Example 1:</h4>
        <p><b>Series:</b> 3, 6, 12, 24, ?</p>
        <p><b>Solution:</b> Multiply each term by 2 → Next term = 48</p>

        <h4 className="text-lg font-semibold text-neon-pink mt-3">Example 2:</h4>
        <p><b>Series:</b> 1, 4, 9, 16, 25, ?</p>
        <p><b>Solution:</b> Perfect squares of consecutive numbers → 36</p>

        <h4 className="text-lg font-semibold text-neon-pink mt-3">Example 3:</h4>
        <p><b>Series:</b> A, C, F, J, O, ?</p>
        <p><b>Solution:</b> +2, +3, +4, +5 → Next letter = U</p>
      </NoteSection>

      {/* 4. Shortcut Tricks */}
      <NoteSection title="4. Shortcut Tricks">
        <ul className="list-disc pl-5 space-y-2">
          <li>Check first and second differences — helps find AP or polynomial patterns.</li>
          <li>Look for <b>multiplicative</b> or <b>divisive</b> ratios for GP-type series.</li>
          <li>In letter series, convert letters to numbers (A=1, B=2, …, Z=26).</li>
          <li>When pattern seems unclear, check alternate or combined patterns.</li>
          <li>For exams, note that <b>“alternating”</b> or <b>“two-rule”</b> series are common.</li>
        </ul>
      </NoteSection>

      {/* 5. Practice Questions */}
      <NoteSection title="5. Practice Questions">
        <ul className="list-decimal pl-5 space-y-2">
          <li>2, 6, 12, 20, 30, ?</li>
          <li>5, 10, 20, 35, 55, ?</li>
          <li>B, E, H, K, N, ?</li>
          <li>A2, C6, E12, G20, ?</li>
          <li>1, 4, 9, 16, 25, ?</li>
        </ul>
        <p className="mt-2 text-sm italic text-gray-400">
          Try solving these before checking solutions — they test both arithmetic and logical pattern detection.
        </p>
      </NoteSection>

    </AptitudeNoteLayout>
  );
}
