// src/pages/Aptitude/Quant/PercentagesNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function PercentagesNotes() {
  const topic = "Percentages";
  const videos = [
    { url: "https://www.youtube.com/embed/_TdyTKpNY8g", title: "Percentages Basics" },
    { url: "https://www.youtube.com/embed/HT7U8F7V4nE", title: "Percentage Tricks & Shortcuts" },
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      
      {/* 1. Conceptual Overview */}
      <NoteSection title="1. Conceptual Overview">
        <p>
          The word <b>“Percent”</b> means “per hundred”. It represents a number as a fraction of 100.  
          For example, 25% means <code>25 out of 100</code> or <code>25/100</code>.  
          Percentages are used in almost every field — such as finance, statistics, exams, profit & loss, and growth analysis.
        </p>
        <p>
          In mathematics, percentages help us express proportions and comparisons clearly.  
          For instance, if 45% of students passed an exam, it means 45 students passed out of every 100.
        </p>
        <p><b>Symbol:</b> % (read as “percent”)</p>
      </NoteSection>

      {/* 2. Importance */}
      <NoteSection title="2. Why Percentages are Important">
        <ul className="list-disc pl-5 space-y-2">
          <li>Used to compare data irrespective of scale (e.g., marks, profits, population growth).</li>
          <li>Forms the foundation for Profit & Loss, Simple Interest, Compound Interest, and Data Interpretation.</li>
          <li>Helps in analyzing increase/decrease trends (growth rate, discount rate, inflation, etc.).</li>
        </ul>
      </NoteSection>

      {/* 3. Conversion Rules */}
      <NoteSection title="3. Conversion Rules">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Fraction → Percentage:</b> (a/b) × 100%</li>
          <li><b>Percentage → Fraction:</b> x% = x / 100</li>
          <li><b>Decimal → Percentage:</b> Multiply by 100</li>
          <li><b>Percentage → Decimal:</b> Divide by 100</li>
        </ul>
        <p><b>Examples:</b></p>
        <ul className="list-disc pl-5 space-y-2">
          <li>1/4 = (1/4 × 100) = 25%</li>
          <li>0.6 = 0.6 × 100 = 60%</li>
          <li>35% = 35/100 = 0.35</li>
        </ul>
      </NoteSection>

      {/* 4. Key Formulas */}
      <NoteSection title="4. Key Formulas">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Percentage of a Quantity:</b> (Value × Percentage) / 100</li>
          <li><b>Percentage Increase:</b> ((New - Old) / Old) × 100</li>
          <li><b>Percentage Decrease:</b> ((Old - New) / Old) × 100</li>
          <li><b>Value after Increase:</b> New = Old × (1 + R/100)</li>
          <li><b>Value after Decrease:</b> New = Old × (1 - R/100)</li>
          <li>If A is R% more than B ⇒ B is less than A by (R / (100 + R)) × 100%</li>
          <li>If A is R% less than B ⇒ B is more than A by (R / (100 - R)) × 100%</li>
        </ul>
      </NoteSection>

      {/* 5. Solved Examples */}
      <NoteSection title="5. Solved Examples">
        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 1: Basic Percentage</h4>
        <p className="italic"><b>Problem:</b> A student scores 60 marks out of 80. Find the percentage.</p>
        <p><b>Solution:</b><br/>
          Percentage = (60 / 80) × 100 = 75%
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 2: Percentage Increase</h4>
        <p className="italic"><b>Problem:</b> A salary increases from ₹50,000 to ₹60,000. What is the % increase?</p>
        <p><b>Solution:</b><br/>
          Increase = 60,000 - 50,000 = 10,000<br/>
          % Increase = (10,000 / 50,000) × 100 = 20%
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 3: Percentage Decrease</h4>
        <p className="italic"><b>Problem:</b> A product’s price decreases from ₹500 to ₹400. Find the % decrease.</p>
        <p><b>Solution:</b><br/>
          Decrease = 500 - 400 = 100<br/>
          % Decrease = (100 / 500) × 100 = 20%
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 4: Reverse Percentage</h4>
        <p className="italic"><b>Problem:</b> If a number increases by 20% to become 72, find the original number.</p>
        <p><b>Solution:</b><br/>
          Let the original number be x.<br/>
          x × (1 + 20/100) = 72 → x × 1.2 = 72 → x = 72 / 1.2 = 60
        </p>
      </NoteSection>

      {/* 6. Shortcuts & Tricks */}
      <NoteSection title="6. Shortcuts & Tricks">
        <ul className="list-disc pl-5 space-y-2">
          <li>1% of a number = number ÷ 100</li>
          <li>10% of a number = number ÷ 10</li>
          <li>5% of a number = (10% of number) ÷ 2</li>
          <li>25% = 1/4 → divide the number by 4</li>
          <li>50% = 1/2 → divide the number by 2</li>
          <li>75% = 3/4 → multiply number by 3 and divide by 4</li>
        </ul>
      </NoteSection>

      {/* 7. Real-life Applications */}
      <NoteSection title="7. Real-life Applications">
        <ul className="list-disc pl-5 space-y-2">
          <li>Calculating marks or grades in exams</li>
          <li>Bank interest rates (increase/decrease in balance)</li>
          <li>Profit and loss in business</li>
          <li>Discounts on products</li>
          <li>Data interpretation (population growth, inflation, etc.)</li>
        </ul>
      </NoteSection>

      {/* 8. Practice Questions */}
      <NoteSection title="8. Practice Questions">
        <ol className="list-decimal pl-5 space-y-2">
          <li>Find 25% of 480.</li>
          <li>A number is increased by 15% and then decreased by 20%. Find the net percentage change.</li>
          <li>In a class of 60 students, 45% are boys. How many are girls?</li>
          <li>A product costs ₹800 after a 20% discount. What was the original price?</li>
          <li>If the price of sugar increases from ₹40/kg to ₹50/kg, find the percentage increase.</li>
        </ol>
      </NoteSection>

    </AptitudeNoteLayout>
  );
}
