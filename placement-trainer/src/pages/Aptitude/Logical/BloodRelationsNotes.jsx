// src/pages/Aptitude/Logical/BloodRelationsNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function BloodRelationsNotes() {
  const topic = "Blood Relations";
  const videos = [
    { url: "https://www.youtube.com/embed/hzT7z8jrdGg", title: "Blood Relations Tricks & Concepts" },
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>

      {/* Conceptual Overview */}
      <NoteSection title="1. Conceptual Overview">
        <p>
          This topic tests your understanding of family relationships based on given statements. 
          You may need to determine the relationship between two individuals or identify a missing link in a family chain.
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Common Family Relations:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Parents:</b> Father, Mother</li>
          <li><b>Children:</b> Son, Daughter</li>
          <li><b>Siblings:</b> Brother, Sister</li>
          <li><b>Grand Relations:</b> Grandfather, Grandmother, Grandson, Granddaughter</li>
          <li><b>Extended Relations:</b> Uncle, Aunt, Nephew, Niece, Cousin</li>
          <li><b>In-Laws:</b> Father-in-law, Mother-in-law, Brother-in-law, Sister-in-law</li>
        </ul>
      </NoteSection>

      {/* Relation Types */}
      <NoteSection title="2. Types of Relationships">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Direct Relations:</b> Stated directly, e.g., "A is the father of B".</li>
          <li><b>Indirect Relations:</b> Need inference, e.g., "A is the brother of B’s father" → A is B’s uncle.</li>
          <li><b>Mixed Relations:</b> More than one generation or side, e.g., maternal/paternal sides.</li>
        </ul>
      </NoteSection>

      {/* Diagram & Tips */}
      <NoteSection title="3. How to Approach & Tips">
        <ul className="list-disc pl-5 space-y-2">
          <li>✅ <b>Draw a Family Tree:</b> Represent each person clearly using symbols:
            <ul className="list-disc pl-5">
              <li>Male → □ (Square)</li>
              <li>Female → ○ (Circle)</li>
              <li>Marriage → ― (Horizontal line)</li>
              <li>Children → | (Vertical line)</li>
            </ul>
          </li>
          <li>✅ <b>Work Step-by-Step:</b> Decode each part of the statement before combining.</li>
          <li>✅ <b>Avoid Assumptions:</b> Do not assume gender unless specified.</li>
          <li>✅ <b>Look for Clues:</b> Words like “his”, “her”, “father of”, “brother of” help you identify the chain.</li>
          <li>✅ <b>Mark Generations:</b> Keep family members from different generations clearly separated (e.g., grandparents → parents → children).</li>
        </ul>
      </NoteSection>

      {/* Example Problems */}
      <NoteSection title="4. Solved Examples">
        <h4 className="text-lg font-semibold text-neon-pink pt-2">Example 1:</h4>
        <p><b>Statement:</b> A is the brother of B. B is the daughter of C. How is A related to C?</p>
        <p><b>Explanation:</b> B is the daughter of C → C is parent of B. A is brother of B → A is son of C.  
        <b>Answer:</b> A is the son of C.</p>

        <h4 className="text-lg font-semibold text-neon-pink pt-4">Example 2:</h4>
        <p><b>Statement:</b> A is the father of B, but B is not the son of A. How is B related to A?</p>
        <p><b>Explanation:</b> If B is not the son, B must be the daughter.  
        <b>Answer:</b> B is the daughter of A.</p>

        <h4 className="text-lg font-semibold text-neon-pink pt-4">Example 3:</h4>
        <p><b>Statement:</b> P is the brother of Q. Q is the mother of R. How is P related to R?</p>
        <p><b>Explanation:</b> P → brother of Q → Q is R’s mother → P is maternal uncle of R.  
        <b>Answer:</b> Maternal Uncle.</p>

        <h4 className="text-lg font-semibold text-neon-pink pt-4">Example 4:</h4>
        <p><b>Statement:</b> A is the daughter of B who is the husband of C. How is A related to C?</p>
        <p><b>Explanation:</b> B is husband of C → C is wife of B. A is daughter of B → A is daughter of C.  
        <b>Answer:</b> Daughter.</p>
      </NoteSection>

      {/* Shortcut Tricks */}
      <NoteSection title="5. Shortcut Tricks">
        <ul className="list-disc pl-5 space-y-2">
          <li>🔹 <b>“Of” → Move one generation up.</b>  
            Example: “Father of B” → B’s father (up one level).</li>
          <li>🔹 <b>“Brother/Sister of” → Same generation.</b></li>
          <li>🔹 <b>“Son/Daughter of” → Move one generation down.</b></li>
          <li>🔹 <b>“Husband/Wife of” → Same generation, opposite gender.</b></li>
          <li>🔹 <b>Maternal</b> = Mother’s side | <b>Paternal</b> = Father’s side.</li>
        </ul>
      </NoteSection>

      {/* Practice Questions */}
      <NoteSection title="6. Practice Questions">
        <ol className="list-decimal pl-5 space-y-2">
          <li>A is the son of B. B is the daughter of C. How is A related to C?</li>
          <li>P is the father of Q and the brother of R. How is R related to Q?</li>
          <li>X is the wife of Y. Y is the brother of Z. How is X related to Z?</li>
          <li>M is the mother of N. N is the brother of O. How is M related to O?</li>
          <li>A is the sister of B. B is the father of C. How is A related to C?</li>
        </ol>
      </NoteSection>

    </AptitudeNoteLayout>
  );
}
