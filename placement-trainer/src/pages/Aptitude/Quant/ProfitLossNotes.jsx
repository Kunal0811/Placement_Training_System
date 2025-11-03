// src/pages/Aptitude/Quant/ProfitLossNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function ProfitLossNotes() {
  const topic = "Profit & Loss";
  const videos = [
    { url: "https://youtube.com/embed/_cW7_BUDYcw", title: "Profit & Loss Concepts" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="1. Conceptual Overview">
        <p>This topic deals with the monetary gains and losses in a commercial transaction.</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><b>Cost Price (CP):</b> The price at which an article is purchased.</li>
          <li><b>Selling Price (SP):</b> The price at which an article is sold.</li>
          <li><b>Profit (Gain):</b> If SP &gt; CP, Profit = SP - CP.</li>
          <li><b>Loss:</b> If CP &gt; SP, Loss = CP - SP.</li>
        </ul>
      </NoteSection>
      <NoteSection title="2. Key Concepts & Formulas">
         <ul className="list-disc pl-5 space-y-2">
          <li><b>Profit %:</b> (Profit / CP) × 100</li>
          <li><b>Loss %:</b> (Loss / CP) × 100</li>
          <li><b>Find SP (Given Profit %):</b> SP = CP × ((100 + Profit %) / 100)</li>
          <li><b>Find SP (Given Loss %):</b> SP = CP × ((100 - Loss %) / 100)</li>
          <li><b>Find CP (Given Profit %):</b> CP = SP × (100 / (100 + Profit %))</li>
          <li><b>Find CP (Given Loss %):</b> CP = SP × (100 / (100 - Loss %))</li>
        </ul>
      </NoteSection>
      <NoteSection title="3. Solved Examples">
        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 1: Profit Percent</h4>
        <p className="italic"><b>Problem:</b> An item is bought for ₹150 and sold for ₹180. Find the profit percentage.</p>
        <p><b>Solution:</b><br/>
           CP = ₹150, SP = ₹180<br/>
           Profit = SP - CP = 180 - 150 = ₹30<br/>
           Profit % = (Profit / CP) × 100 = (30 / 150) × 100<br/>
           Profit % = (1 / 5) × 100 = 20%
        </p>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}