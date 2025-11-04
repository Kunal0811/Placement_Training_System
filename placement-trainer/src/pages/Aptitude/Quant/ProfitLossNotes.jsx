// src/pages/Aptitude/Quant/ProfitLossNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function ProfitLossNotes() {
  const topic = "Profit & Loss";
  const videos = [
    { url: "https://www.youtube.com/embed/_cW7_BUDYcw", title: "Profit & Loss Concepts" },
    { url: "https://www.youtube.com/embed/3n6jF5A4FGk", title: "Profit & Loss Tricks and Shortcuts" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      
      {/* 1. Conceptual Overview */}
      <NoteSection title="1. Conceptual Overview">
        <p>
          The concept of <b>Profit and Loss</b> is essential in commerce and business mathematics.  
          It helps determine whether a transaction results in a <b>gain (profit)</b> or a <b>loss</b>.
          Every buying and selling transaction involves two key values — the <b>Cost Price (CP)</b> and the <b>Selling Price (SP)</b>.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><b>Cost Price (CP):</b> The price at which an article is purchased.</li>
          <li><b>Selling Price (SP):</b> The price at which an article is sold.</li>
          <li><b>Profit (Gain):</b> If SP &gt; CP → Profit = SP - CP.</li>
          <li><b>Loss:</b> If CP &gt; SP → Loss = CP - SP.</li>
        </ul>
        <p className="mt-2">
          Profit and Loss are always calculated on the <b>Cost Price (CP)</b> unless stated otherwise.
        </p>
      </NoteSection>

      {/* 2. Key Concepts & Formulas */}
      <NoteSection title="2. Key Concepts & Formulas">
         <ul className="list-disc pl-5 space-y-2">
          <li><b>Profit %:</b> (Profit / CP) × 100</li>
          <li><b>Loss %:</b> (Loss / CP) × 100</li>
          <li><b>Find SP (Given Profit %):</b> SP = CP × ((100 + Profit %) / 100)</li>
          <li><b>Find SP (Given Loss %):</b> SP = CP × ((100 - Loss %) / 100)</li>
          <li><b>Find CP (Given Profit %):</b> CP = SP × (100 / (100 + Profit %))</li>
          <li><b>Find CP (Given Loss %):</b> CP = SP × (100 / (100 - Loss %))</li>
          <li><b>Relationship between Profit % and Loss %:</b> When gain and loss are on the same value, <br/>Net % loss = (Loss% - Profit%) (if Loss% {'>'} Profit%)</li>
          <li><b>Marked Price (MP):</b> The price printed on the article before any discount.</li>
          <li><b>Discount %:</b> (Discount / MP) × 100</li>
          <li><b>Selling Price (after discount):</b> SP = MP × ((100 - Discount %) / 100)</li>
        </ul>
      </NoteSection>

      {/* 3. Solved Examples */}
      <NoteSection title="3. Solved Examples">

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 1: Profit Percentage</h4>
        <p className="italic"><b>Problem:</b> An item is bought for ₹150 and sold for ₹180. Find the profit percentage.</p>
        <p><b>Solution:</b><br/>
          CP = ₹150, SP = ₹180<br/>
          Profit = SP - CP = 180 - 150 = ₹30<br/>
          Profit % = (30 / 150) × 100 = 20%
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 2: Loss Percentage</h4>
        <p className="italic"><b>Problem:</b> A book is bought for ₹500 and sold for ₹450. Find the loss %.</p>
        <p><b>Solution:</b><br/>
          Loss = CP - SP = 500 - 450 = 50<br/>
          Loss % = (50 / 500) × 100 = 10%
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 3: Finding Selling Price</h4>
        <p className="italic"><b>Problem:</b> Find SP if CP = ₹600 and Profit % = 25%.</p>
        <p><b>Solution:</b><br/>
          SP = 600 × ((100 + 25) / 100) = 600 × (125 / 100) = ₹750
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 4: Finding Cost Price</h4>
        <p className="italic"><b>Problem:</b> SP = ₹840 and Profit % = 20%. Find CP.</p>
        <p><b>Solution:</b><br/>
          CP = SP × (100 / (100 + Profit%)) = 840 × (100 / 120) = ₹700
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 5: Discount Concept</h4>
        <p className="italic"><b>Problem:</b> A shirt’s marked price is ₹800. If the shopkeeper offers a 10% discount, find the selling price.</p>
        <p><b>Solution:</b><br/>
          Discount = 10% of 800 = 80<br/>
          SP = 800 - 80 = ₹720
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 6: Successive Transactions</h4>
        <p className="italic"><b>Problem:</b> A man buys an article for ₹1000, sells it at a 10% profit, and again the buyer sells it at a 20% profit. Find the final selling price.</p>
        <p><b>Solution:</b><br/>
          First sale: SP₁ = 1000 × (110/100) = ₹1100<br/>
          Second sale: SP₂ = 1100 × (120/100) = ₹1320<br/>
          Final SP = ₹1320
        </p>
      </NoteSection>

      {/* 4. Shortcuts & Tricks */}
      <NoteSection title="4. Shortcuts & Tricks">
        <ul className="list-disc pl-5 space-y-2">
          <li>If Profit = Loss → No overall gain or loss.</li>
          <li>When SP is same but % profit and % loss are different:<br/>
              <b>Loss % = (Common Loss × 100) / (CP)</b></li>
          <li>When an article is sold at two different prices, the formula for overall % loss or gain:<br/>
              <b>Overall % = (Difference² / (CP × 2))</b></li>
          <li>If profit % and loss % are equal on same CP and SP are interchanged, there will always be a loss.</li>
          <li>To make x% profit, mark the price = CP × (100 + x) / (100 - discount%)</li>
        </ul>
      </NoteSection>

      {/* 5. Real-Life Applications */}
      <NoteSection title="5. Real-Life Applications">
        <ul className="list-disc pl-5 space-y-2">
          <li>Used in business to calculate profit margins.</li>
          <li>Helpful in comparing cost and selling prices of products.</li>
          <li>Used in taxation, accounting, and retail discounts.</li>
          <li>Useful in analyzing investment gains or losses.</li>
        </ul>
      </NoteSection>

      {/* 6. Practice Questions */}
      <NoteSection title="6. Practice Questions">
        <ol className="list-decimal pl-5 space-y-2">
          <li>An article is bought for ₹240 and sold for ₹288. Find the profit percentage.</li>
          <li>A trader sells an item at a loss of 12%. If the item was sold for ₹880, find the cost price.</li>
          <li>The marked price of an article is ₹2000, and it’s sold for ₹1700. Find the discount %.</li>
          <li>A man sells two watches for ₹1200 each. On one he gains 20% and on the other he loses 20%. Find his overall profit or loss %.</li>
          <li>A retailer wants a 10% profit after giving a 5% discount. At what percent above the cost price should he mark the goods?</li>
        </ol>
      </NoteSection>

    </AptitudeNoteLayout>
  );
}
