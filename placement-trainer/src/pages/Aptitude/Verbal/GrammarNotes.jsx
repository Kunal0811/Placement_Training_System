// src/pages/Aptitude/Verbal/GrammarNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function GrammarNotes() {
  const topic = "Grammar";
  const videos = [
    { url: "https://www.youtube.com/embed/0nBAQeUph1w", title: "Grammar Basics" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="Conceptual Overview">
        <p>Grammar is the system of a language. For aptitude tests, this focuses on finding errors in sentences (spotting errors) or filling in blanks with the correct word.</p>
        <h4 className="text-xl font-semibold text-neon-pink pt-2">Key Areas to Focus On</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Subject-Verb Agreement:</b> A singular subject takes a singular verb (e.g., "The dog barks"). A plural subject takes a plural verb (e.g., "The dogs bark").</li>
          <li><b>Tenses:</b> Ensure the verb tenses are consistent and logical (e.g., don't mix past and present tenses randomly).</li>
          <li><b>Prepositions:</b> Know when to use "in", "on", "at", "with", "by", "for". (e.g., "He is good <b>at</b> mathematics.")</li>
          <li><b>Articles:</b> Correct usage of "a", "an", and "the".</li>
        </ul>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}