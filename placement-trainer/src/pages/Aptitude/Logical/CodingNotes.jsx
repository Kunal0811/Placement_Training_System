// src/pages/Aptitude/Logical/CodingNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function CodingNotes() {
  const topic = "Coding-Decoding";
  const videos = [
    { url: "https://www.youtube.com/embed/0dB6S98Rrko", title: "Coding-Decoding Tricks" },
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      
      {/* Concept Section */}
      <NoteSection title="Conceptual Overview">
        <p>
          In Coding-Decoding problems, a word or message is written in a particular code or pattern. 
          The task is to analyze the pattern or rule used in the coding process and then apply 
          the same logic to decode another word or to find the code for a given word.
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Types of Coding-Decoding:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Letter Coding:</b> Letters in the words are replaced by other letters following a certain pattern.</li>
          <li><b>Number Coding:</b> Words or letters are coded into numbers based on their position or a predefined scheme.</li>
          <li><b>Substitution Coding:</b> Words are substituted with other words or symbols.</li>
          <li><b>Mixed Coding:</b> Combination of different coding patterns.</li>
          <li><b>Conditional Coding:</b> A set of statements define a logical relationship between codes and words.</li>
        </ul>
      </NoteSection>

      {/* Common Patterns Section */}
      <NoteSection title="Common Patterns and Rules">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Alphabet Shift (Forward/Backward):</b> Each letter is moved a fixed number of positions in the alphabet.<br />
            Example: <i>CAT → ECV</i> (each letter moved +2).
          </li>
          <li><b>Reversing:</b> The letters of the word are reversed.<br />
            Example: <i>WORD → DROW</i>.
          </li>
          <li><b>Substitution:</b> Each letter or number is replaced by another fixed symbol, number, or letter.<br />
            Example: <i>A=1, B=2, ... Z=26</i>.
          </li>
          <li><b>Positional Coding:</b> Letters are replaced with their corresponding position in the alphabet.<br />
            Example: <i>BAD → 2 1 4</i>.
          </li>
          <li><b>Opposite Letter Coding:</b> Letters are replaced with their opposites (A↔Z, B↔Y, etc.).<br />
            Example: <i>CAT → XZG</i>.
          </li>
          <li><b>Interchanging Letters:</b> Certain letters are swapped based on a fixed position rule.<br />
            Example: First ↔ Last, Second ↔ Second last, etc.
          </li>
        </ul>
      </NoteSection>

      {/* Example Section */}
      <NoteSection title="Solved Examples">
        <h4 className="text-lg font-semibold text-neon-pink pt-2">Example 1: Letter Coding</h4>
        <p><b>Q:</b> In a certain code, <i>APPLE</i> is written as <i>CRRNG</i>. How is <i>BANANA</i> written in that code?</p>
        <p><b>Explanation:</b> Each letter is moved 2 steps forward (A→C, P→R, etc.). So, BANANA → DCPCPC.</p>

        <h4 className="text-lg font-semibold text-neon-pink pt-4">Example 2: Number Coding</h4>
        <p><b>Q:</b> If <i>A=1, B=2, ... Z=26</i>, then how is the word <i>CAT</i> coded?</p>
        <p><b>Ans:</b> C=3, A=1, T=20 → 3-1-20</p>

        <h4 className="text-lg font-semibold text-neon-pink pt-4">Example 3: Opposite Letter Coding</h4>
        <p><b>Q:</b> If <i>AIR</i> is coded as <i>ZRI</i>, find the logic.</p>
        <p><b>Ans:</b> Each letter is replaced with its opposite: A↔Z, I↔R, R↔I.</p>

        <h4 className="text-lg font-semibold text-neon-pink pt-4">Example 4: Substitution Coding</h4>
        <p><b>Q:</b> If <i>‘Sky is Blue’</i> is coded as <i>‘Ne La Po’</i> and <i>‘Blue is Water’</i> as <i>‘Po La Ti’</i>, then what code represents ‘Water’?</p>
        <p><b>Ans:</b> From both, “Blue is” = “Po La” is common → remaining “Water” = “Ti”.</p>
      </NoteSection>

      {/* Quick Tricks Section */}
      <NoteSection title="Quick Tricks & Tips">
        <ul className="list-disc pl-5 space-y-2">
          <li>✅ Always check for repetition of words or letters to find consistent patterns.</li>
          <li>✅ Look for alphabet position differences (A=1, Z=26) to spot +/– shifts.</li>
          <li>✅ Reverse the letters when you don’t find any direct relation.</li>
          <li>✅ In substitution coding, cross-compare multiple statements to identify common pairs.</li>
          <li>✅ Memorize opposite letter pairs (A↔Z, B↔Y, C↔X, etc.).</li>
        </ul>
      </NoteSection>

      {/* Practice Section */}
      <NoteSection title="Practice Questions">
        <ol className="list-decimal pl-5 space-y-2">
          <li>If <i>MAN</i> is coded as <i>OCP</i>, what is the code for <i>WOMAN</i>?</li>
          <li>In a certain code, <i>FRUIT</i> is written as <i>HTWKV</i>. How is <i>APPLE</i> coded?</li>
          <li>If <i>COOL = DPPM</i>, then find the code for <i>HEAT</i>.</li>
          <li>‘Book is Useful’ → ‘Ti Mo Ka’, and ‘Reading Book’ → ‘Li Ti’, find the code for ‘Reading’.</li>
          <li>If <i>RAIN</i> → <i>IFMZ</i>, what is the code for <i>SUN</i>?</li>
        </ol>
      </NoteSection>

    </AptitudeNoteLayout>
  );
}
