// src/pages/Aptitude/Verbal/ComprehensionNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function ComprehensionNotes() {
  const topic = "Reading Comprehension";
  const videos = [
    { url: "https://www.youtube.com/embed/TbQp4ij0T44", title: "Reading Comprehension Tricks & Tips" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      
      {/* Concept Overview */}
      <NoteSection title="Conceptual Overview">
        <p>
          Reading comprehension tests your ability to read, understand, and interpret a passage of text. 
          The passage may be factual, inferential, or analytical in nature. 
          You’ll need to answer questions that test your understanding, vocabulary, and reasoning.
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Types of Passages</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Factual:</b> Based on data, reports, or facts. Questions test your memory and accuracy.</li>
          <li><b>Inferential:</b> Requires logical conclusions beyond direct statements.</li>
          <li><b>Analytical/Critical:</b> Evaluates your ability to analyze arguments and assumptions.</li>
        </ul>
      </NoteSection>

      {/* Question Types */}
      <NoteSection title="Common Question Types">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Main Idea:</b> Identify the core message or thesis of the passage.</li>
          <li><b>Supporting Details:</b> Pick specific facts or examples that reinforce the main point.</li>
          <li><b>Inference:</b> Draw conclusions not directly stated but implied.</li>
          <li><b>Vocabulary in Context:</b> Understand word meanings based on surrounding text.</li>
          <li><b>Author’s Tone/Purpose:</b> Determine attitude (neutral, critical, persuasive, etc.).</li>
        </ul>
      </NoteSection>

      {/* Solving Tips */}
      <NoteSection title="Tips to Improve">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Read the Questions First:</b> Skim questions before reading to know what to focus on.</li>
          <li><b>Identify the Main Idea:</b> Summarize each paragraph in a few words to grasp flow.</li>
          <li><b>Inference vs. Fact:</b> Distinguish between explicit information and logical assumptions.</li>
          <li><b>Eliminate Wrong Options:</b> Narrow down by removing choices that contradict the passage.</li>
          <li><b>Practice Regularly:</b> Reading newspapers, journals, or editorials improves comprehension speed.</li>
        </ul>
      </NoteSection>

      {/* Example */}
      <NoteSection title="Example">
        <p>
          <b>Passage:</b> “Climate change poses a major challenge to agriculture. 
          Farmers are increasingly relying on technology to predict weather patterns and improve crop yields.”
        </p>
        <p><b>Question:</b> What is the main idea of the passage?</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>A) Climate change affects global trade.</li>
          <li>B) Farmers are adapting to climate change using technology.</li>
          <li>C) Weather prediction has become unreliable.</li>
          <li>D) Technology has failed to help farmers.</li>
        </ul>
        <p><b>Answer:</b> (B) Farmers are adapting to climate change using technology.</p>
      </NoteSection>

      {/* Quick Strategy */}
      <NoteSection title="Quick Strategy">
        <ul className="list-disc pl-5 space-y-2">
          <li>📘 Skim the passage once for general understanding.</li>
          <li>🔍 Re-read key sections when answering inference questions.</li>
          <li>⏱ Manage time — don’t overthink vocabulary or minor details.</li>
          <li>🧠 Focus on *why* the author wrote the passage, not just *what* they said.</li>
        </ul>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}
