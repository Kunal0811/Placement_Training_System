// src/pages/Aptitude/Verbal/GrammarNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function GrammarNotes() {
  const topic = "Grammar";
  const videos = [
    { url: "https://www.youtube.com/embed/0nBAQeUph1w", title: "Grammar Basics and Error Spotting" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      
      {/* Conceptual Overview */}
      <NoteSection title="Conceptual Overview">
        <p>
          Grammar is the backbone of any language. In aptitude and placement exams, 
          grammar questions usually test your understanding of sentence structure, 
          correctness, and usage. You may be asked to identify grammatical errors, 
          choose the correct word, or improve sentence construction.
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Key Areas to Focus On</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Parts of Speech:</b> Understand nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions, and interjections.</li>
          <li><b>Subject-Verb Agreement:</b> Singular subjects take singular verbs, and plural subjects take plural verbs.<br />Example: “The dog <b>barks</b>.” vs “The dogs <b>bark</b>.”</li>
          <li><b>Tenses:</b> Ensure verbs reflect correct time and consistency.<br />Example: “He <b>worked</b> hard and <b>won</b> the prize.” (Both in past tense)</li>
          <li><b>Prepositions:</b> Words that show relationships between nouns/pronouns and other words (in, on, at, for, by, etc.).<br />Example: “She sat <b>on</b> the chair.”</li>
          <li><b>Articles:</b> Use “a” or “an” for general nouns, “the” for specific ones.<br />Example: “<b>An</b> apple a day keeps <b>the</b> doctor away.”</li>
        </ul>
      </NoteSection>

      {/* Error Spotting */}
      <NoteSection title="Error Spotting Rules">
        <p>
          Error spotting questions present a sentence divided into parts. You must 
          find which part contains a grammatical or structural mistake.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Rule 1:</b> Keep tenses consistent within a sentence.</li>
          <li><b>Rule 2:</b> Check if the subject and verb agree in number.</li>
          <li><b>Rule 3:</b> Ensure correct use of articles and prepositions.</li>
          <li><b>Rule 4:</b> Watch for wrong word forms (e.g., “advise” vs. “advice”).</li>
          <li><b>Rule 5:</b> Avoid double negatives (e.g., “I don’t need no help” ❌).</li>
        </ul>
        <p className="pt-2"><b>Example:</b> “Each of the students <b>have</b> completed their work.” → ❌<br />Correct: “Each of the students <b>has</b> completed his or her work.” ✅</p>
      </NoteSection>

      {/* Sentence Correction */}
      <NoteSection title="Sentence Correction Tips">
        <p>
          You’ll often need to choose the grammatically correct sentence among options. 
          Focus on structure, clarity, and logic.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Check **subject-verb agreement** and **tense consistency**.</li>
          <li>Prefer **active voice** over passive when possible.</li>
          <li>Eliminate **redundant words** and **awkward phrasing**.</li>
          <li>Ensure **parallelism** — all items in a list follow the same structure.<br />Example: “She likes <b>reading, writing, and dancing</b>.” ✅</li>
        </ul>
      </NoteSection>

      {/* Common Mistakes */}
      <NoteSection title="Common Grammar Mistakes">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Incorrect:</b> He is senior than me. → <b>Correct:</b> He is senior <b>to</b> me.</li>
          <li><b>Incorrect:</b> She is good in math. → <b>Correct:</b> She is good <b>at</b> math.</li>
          <li><b>Incorrect:</b> Everyone have gone. → <b>Correct:</b> Everyone <b>has</b> gone.</li>
          <li><b>Incorrect:</b> I prefer coffee than tea. → <b>Correct:</b> I prefer coffee <b>to</b> tea.</li>
        </ul>
      </NoteSection>

      {/* Quick Practice Example */}
      <NoteSection title="Example Practice">
        <p><b>Question:</b> Identify the part of the sentence that has an error:</p>
        <p className="italic">“Neither of the boys <b>are</b> going to school today.”</p>
        <p><b>Answer:</b> “are” should be replaced with “is” — singular verb for “Neither”. ✅</p>
      </NoteSection>

      {/* Quick Strategy */}
      <NoteSection title="Quick Strategy">
        <ul className="list-disc pl-5 space-y-2">
          <li>📘 Read the full sentence before deciding the error.</li>
          <li>🔍 Check for **basic rules** first — tenses, articles, agreement.</li>
          <li>🧠 Remember exceptions (e.g., “each”, “either”, “neither” are singular).</li>
          <li>🕒 Don’t overthink — go with the **rule-based correction**, not instinct.</li>
        </ul>
      </NoteSection>

    </AptitudeNoteLayout>
  );
}
