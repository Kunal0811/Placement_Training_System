// src/pages/Aptitude/Verbal/VocabularyNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function VocabularyNotes() {
  const topic = "Vocabulary";
  const videos = [
    { url: "https://www.youtube.com/embed/2F07cfZz2xM", title: "Vocabulary Tricks & Memory Tips" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      
      {/* Conceptual Overview */}
      <NoteSection title="Conceptual Overview">
        <p>
          Vocabulary tests your understanding and usage of English words. 
          It includes recognizing meanings, opposites, and contextual usage. 
          Building a strong vocabulary improves reading comprehension, writing, 
          and verbal ability in aptitude tests.
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Common Question Types</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Synonyms:</b> Find the word that has the same meaning as the given word.<br />
          Example: <i>Happy → Joyful, Cheerful, Delighted</i></li>
          
          <li><b>Antonyms:</b> Find the word with the opposite meaning.<br />
          Example: <i>Brave → Cowardly</i></li>

          <li><b>Idioms & Phrases:</b> Interpret figurative expressions.<br />
          Example: <i>“Bite the bullet” → To face a difficult situation bravely.</i></li>

          <li><b>Phrasal Verbs:</b> A verb + preposition/adverb combination that changes meaning.<br />
          Example: <i>“Break down” → stop working, “Give up” → stop trying.</i></li>
        </ul>
      </NoteSection>

      {/* Synonyms & Antonyms */}
      <NoteSection title="Synonyms & Antonyms">
        <p>These are the most common vocabulary-based questions in exams.</p>
        <h4 className="text-lg font-semibold text-neon-pink pt-2">Examples:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Synonyms:</b> Rapid → Fast, Quick, Speedy</li>
          <li><b>Antonyms:</b> Generous → Stingy, Miserly</li>
          <li><b>Synonyms:</b> Transparent → Clear, Obvious</li>
          <li><b>Antonyms:</b> Ancient → Modern, New</li>
        </ul>
      </NoteSection>

      {/* Idioms and Phrases */}
      <NoteSection title="Common Idioms & Phrases">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Once in a blue moon:</b> Very rarely.</li>
          <li><b>Break the ice:</b> To initiate conversation.</li>
          <li><b>Burn the midnight oil:</b> To work late into the night.</li>
          <li><b>Hit the nail on the head:</b> To be exactly right.</li>
          <li><b>Piece of cake:</b> Very easy task.</li>
        </ul>
      </NoteSection>

      {/* Phrasal Verbs */}
      <NoteSection title="Common Phrasal Verbs">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Bring up:</b> To raise a topic or a child.</li>
          <li><b>Call off:</b> To cancel something.</li>
          <li><b>Look after:</b> To take care of someone.</li>
          <li><b>Turn down:</b> To reject an offer or request.</li>
          <li><b>Carry on:</b> To continue doing something.</li>
        </ul>
      </NoteSection>

      {/* Word Roots */}
      <NoteSection title="Word Roots (Trick to Learn Vocabulary)">
        <p>
          Many English words come from Latin or Greek roots. Understanding roots 
          helps you guess meanings of unfamiliar words.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>‘Bio’ (Life):</b> Biology, Biography, Antibiotic</li>
          <li><b>‘Chron’ (Time):</b> Chronology, Synchronize, Chronicle</li>
          <li><b>‘Graph’ (Write):</b> Autograph, Paragraph, Telegraph</li>
          <li><b>‘Tele’ (Far):</b> Telephone, Television, Telescope</li>
          <li><b>‘Phobia’ (Fear):</b> Claustrophobia, Hydrophobia, Acrophobia</li>
        </ul>
      </NoteSection>

      {/* Tips to Improve Vocabulary */}
      <NoteSection title="Tips to Improve Vocabulary">
        <ul className="list-disc pl-5 space-y-2">
          <li>📘 <b>Read Daily:</b> Newspapers, articles, and novels help you learn words in context.</li>
          <li>🧠 <b>Use Mnemonics:</b> Memory tricks like “Loquacious = talkative (think of ‘loqua’ = talk).”</li>
          <li>✍️ <b>Maintain a Vocabulary Journal:</b> Write 5 new words daily with meanings and examples.</li>
          <li>🎯 <b>Use Apps:</b> Tools like Quizlet, Vocabulary.com, or flashcards are great for practice.</li>
          <li>🗣️ <b>Use New Words in Sentences:</b> Practical usage helps long-term memory.</li>
        </ul>
      </NoteSection>

      {/* Example Practice */}
      <NoteSection title="Example Practice Questions">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>1.</b> Choose the synonym of <b>‘Obvious’</b>:  
            <br />a) Hidden  &nbsp;&nbsp; b) Clear  &nbsp;&nbsp; c) Faint  &nbsp;&nbsp; d) Dark  
            <br /><b>Answer:</b> (b) Clear
          </li>
          <li><b>2.</b> Choose the antonym of <b>‘Expand’</b>:  
            <br />a) Stretch  &nbsp;&nbsp; b) Enlarge  &nbsp;&nbsp; c) Contract  &nbsp;&nbsp; d) Grow  
            <br /><b>Answer:</b> (c) Contract
          </li>
        </ul>
      </NoteSection>

      {/* Quick Strategy */}
      <NoteSection title="Quick Strategy">
        <ul className="list-disc pl-5 space-y-2">
          <li>Look for <strong>context clues</strong> in the question.</li>
          <li>Eliminate <strong>obviously unrelated options</strong> first.</li>
          <li>Remember <strong>root meanings</strong> — they often hint the answer.</li>
          <li>Revise <strong>10–20 new words daily</strong> before your test.</li>
        </ul>
      </NoteSection>

    </AptitudeNoteLayout>
  );
}
