// src/pages/Aptitude/Quant/InterestNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function InterestNotes() {
  const topic = "Simple & Compound Interest";
  const videos = [
    { url: "https://www.youtube.com/embed/3sRZtUczn-8", title: "Simple & Compound Interest Concepts" },
    { url: "https://www.youtube.com/embed/bpZKQ5H-m_A", title: "Simple Interest & Compound Interest Tricks" }
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      
      {/* 1. Conceptual Overview */}
      <NoteSection title="1. Conceptual Overview">
        <p>
          <b>Interest</b> is the extra money paid for using someone else's money.  
          It is usually expressed as a percentage of the principal amount over a specific time period.
        </p>
        <p>
          There are two major types of interests in aptitude:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><b>Simple Interest (SI):</b> Calculated only on the initial principal. Interest remains constant each year.</li>
          <li><b>Compound Interest (CI):</b> Calculated on the principal plus the interest accumulated in previous periods — i.e., “interest on interest.”</li>
        </ul>
        <p className="mt-2">
          The time period (T) is usually expressed in years unless mentioned otherwise. The rate (R) is always taken as an annual percentage.
        </p>
      </NoteSection>

      {/* 2. Key Formulas */}
      <NoteSection title="2. Key Concepts & Formulas">
        <h4 className="text-lg font-semibold mt-2">Simple Interest (SI)</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Formula:</b> SI = (P × R × T) / 100</li>
          <li><b>Total Amount (A):</b> A = P + SI</li>
          <li><b>Where:</b> P = Principal, R = Rate of Interest, T = Time (in years)</li>
          <li>Interest is <b>same every year</b>.</li>
        </ul>

        <h4 className="text-lg font-semibold mt-4">Compound Interest (CI)</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Amount (A):</b> A = P(1 + R/100)<sup>T</sup></li>
          <li><b>Compound Interest:</b> CI = A - P = P[(1 + R/100)<sup>T</sup> - 1]</li>
          <li>If compounded half-yearly: A = P(1 + (R/2)/100)<sup>2T</sup></li>
          <li>If compounded quarterly: A = P(1 + (R/4)/100)<sup>4T</sup></li>
        </ul>

        <h4 className="text-lg font-semibold mt-4">Difference between CI and SI</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>For 2 years: Difference = P × (R/100)²</li>
          <li>For 3 years: Difference = P × (R/100)² × (3 + R/100)</li>
        </ul>
      </NoteSection>

      {/* 3. Comparison Table */}
      <NoteSection title="3. Simple Interest vs Compound Interest">
        <table className="border border-gray-500 mt-2 w-full text-sm md:text-base">
          <thead className="bg-gray-700">
            <tr>
              <th className="border p-2">Basis</th>
              <th className="border p-2">Simple Interest (SI)</th>
              <th className="border p-2">Compound Interest (CI)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Calculation</td>
              <td className="border p-2">On Principal only</td>
              <td className="border p-2">On Principal + Previous Interest</td>
            </tr>
            <tr>
              <td className="border p-2">Interest per year</td>
              <td className="border p-2">Constant</td>
              <td className="border p-2">Increases every year</td>
            </tr>
            <tr>
              <td className="border p-2">Growth Type</td>
              <td className="border p-2">Linear</td>
              <td className="border p-2">Exponential</td>
            </tr>
            <tr>
              <td className="border p-2">Formula</td>
              <td className="border p-2">SI = (P × R × T) / 100</td>
              <td className="border p-2">A = P(1 + R/100)<sup>T</sup></td>
            </tr>
          </tbody>
        </table>
      </NoteSection>

      {/* 4. Solved Examples */}
      <NoteSection title="4. Solved Examples">
        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 1: Simple Interest</h4>
        <p className="italic"><b>Problem:</b> Find the simple interest on ₹5000 at 8% per annum for 3 years.</p>
        <p><b>Solution:</b><br/>
          SI = (P × R × T) / 100 = (5000 × 8 × 3) / 100 = ₹1200<br/>
          <b>Amount =</b> P + SI = 5000 + 1200 = ₹6200
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 2: Compound Interest (Annual)</h4>
        <p className="italic"><b>Problem:</b> Find the compound interest on ₹8000 at 10% per annum for 2 years.</p>
        <p><b>Solution:</b><br/>
          A = P(1 + R/100)<sup>T</sup> = 8000 × (1.1)<sup>2</sup> = 8000 × 1.21 = ₹9680<br/>
          CI = 9680 - 8000 = ₹1680
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 3: Half-Yearly Compounding</h4>
        <p className="italic"><b>Problem:</b> Find CI on ₹10,000 at 10% per annum for 1 year, compounded half-yearly.</p>
        <p><b>Solution:</b><br/>
          Rate per half-year = 10/2 = 5%, Number of half-years = 2<br/>
          A = 10,000 × (1 + 5/100)<sup>2</sup> = 10,000 × (1.05)<sup>2</sup> = 10,000 × 1.1025 = ₹11,025<br/>
          CI = 11,025 - 10,000 = ₹1,025
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 4: Difference between CI and SI</h4>
        <p className="italic"><b>Problem:</b> Find the difference between CI and SI on ₹5000 at 10% per annum for 2 years.</p>
        <p><b>Solution:</b><br/>
          Difference = P × (R/100)² = 5000 × (10/100)² = 5000 × 0.01 = ₹50
        </p>
      </NoteSection>

      {/* 5. Shortcuts & Tricks */}
      <NoteSection title="5. Shortcuts & Tricks">
        <ul className="list-disc pl-5 space-y-2">
          <li>For 2 years, Difference between CI and SI = P × (R/100)²</li>
          <li>For small time (≤ 2 years), approximate CI ≈ SI.</li>
          <li>If rate or time doubles, SI also doubles (since linear).</li>
          <li>In CI, for same rate and time, <b>CI ≥ SI</b>.</li>
          <li>If interest is compounded quarterly, divide rate by 4 and multiply time by 4.</li>
          <li>For quick percentage growth, use <b>Successive % formula:</b> a + b + (ab / 100)</li>
        </ul>
      </NoteSection>

      {/* 6. Real-Life Applications */}
      <NoteSection title="6. Real-Life Applications">
        <ul className="list-disc pl-5 space-y-2">
          <li>Bank loans and savings accounts</li>
          <li>Fixed deposits and recurring deposits</li>
          <li>Credit card interest and EMIs</li>
          <li>Investment growth and depreciation</li>
        </ul>
      </NoteSection>

      {/* 7. Practice Questions */}
      <NoteSection title="7. Practice Questions">
        <ol className="list-decimal pl-5 space-y-2">
          <li>Find SI on ₹9000 at 6% per annum for 5 years.</li>
          <li>Find CI on ₹12,000 at 8% per annum for 2 years compounded annually.</li>
          <li>The difference between CI and SI on ₹5000 for 2 years at 10% p.a. is ₹50. Verify.</li>
          <li>In how many years will ₹2000 amount to ₹2600 at 5% simple interest?</li>
          <li>At what rate will ₹10,000 amount to ₹12,100 in 2 years, compounded annually?</li>
        </ol>
      </NoteSection>

    </AptitudeNoteLayout>
  );
}
