// src/pages/Aptitude/Quant/NumberSystemNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function NumberSystemNotes() {
  const topic = "Number System";
  const videos = [
    { url: "https://youtube.com/embed/qlEvy3pgmKU", title: "Number System Basics" },
    { url: "https://youtube.com/embed/UKXCnwWSZEI", title: "Divisibility Rules" },
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      <NoteSection title="1. Conceptual Overview">
        <p>The <b>Number System</b> is a fundamental concept in mathematics that deals with different types of numbers, their properties, and the rules governing their operations. In aptitude, it's not just about knowing what numbers are, but how they behave, how to classify them, and how to perform calculations efficiently.</p>
        <h4 className="text-xl font-semibold text-neon-pink pt-2">Why is it important?</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Core of Aptitude:</b> Many other topics like Simplification, HCF & LCM, Averages, Percentages, and even Data Interpretation rely heavily on a strong understanding of numbers.</li>
          <li><b>Direct Questions:</b> You'll find direct questions on divisibility rules, prime numbers, remainders, unit digits, and number series in almost every competitive exam.</li>
        </ul>
      </NoteSection>

      <NoteSection title="2. Key Concepts & Formulas">
        <h4 className="text-xl font-semibold text-neon-pink pt-2">A. Classification of Numbers</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Natural Numbers (N):</b> Counting numbers {`{1, 2, 3, 4, ...}`}</li>
          <li><b>Whole Numbers (W):</b> Natural numbers including zero {`{0, 1, 2, 3, 4, ...}`}</li>
          <li><b>Prime Numbers:</b> Natural numbers greater than 1 that have exactly two distinct positive divisors: 1 and itself. (e.g., 2, 3, 5, 7, 11, ...). 2 is the only even prime number.</li>
          <li><b>Composite Numbers:</b> Natural numbers greater than 1 that are not prime.</li>
        </ul>

        <h4 className="text-xl font-semibold text-neon-pink pt-2">B. Divisibility Rules</h4>
         <ul className="list-disc pl-5 space-y-2">
          <li><b>By 3:</b> A number is divisible by 3 if the sum of its digits is divisible by 3.</li>
          <li><b>By 4:</b> A number is divisible by 4 if the number formed by its last two digits is divisible by 4.</li>
          <li><b>By 9:</b> A number is divisible by 9 if the sum of its digits is divisible by 9.</li>
          <li><b>By 11:</b> A number is divisible by 11 if the (sum of odd-placed digits) - (sum of even-placed digits) is 0 or a multiple of 11.</li>
        </ul>
        
        <h4 className="text-xl font-semibold text-neon-pink pt-2">C. HCF & LCM</h4>
         <ul className="list-disc pl-5 space-y-2">
          <li><b>HCF (Highest Common Factor):</b> The largest number that divides two or more numbers.</li>
          <li><b>LCM (Least Common Multiple):</b> The smallest number that is a multiple of two or more numbers.</li>
          <li><b>Key Formula:</b> For two numbers 'a' and 'b', <b>a × b = HCF(a, b) × LCM(a, b)</b></li>
        </ul>
      </NoteSection>

      <NoteSection title="3. Solved Examples">
          <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 1: HCF & LCM</h4>
          <p className="italic"><b>Problem:</b> The HCF of two numbers is 12, and their product is 4320. What is their LCM?</p>
          <p><b>Solution:</b><br/>
             We use the formula: Product = HCF × LCM<br/>
             4320 = 12 × LCM<br/>
             LCM = 4320 / 12<br/>
             LCM = 360
          </p>

          <h4 className="text-xl font-semibold text-neon-pink pt-2">Example 2: Divisibility by 11</h4>
          <p className="italic"><b>Problem:</b> Is the number 789456 divisible by 11?</p>
          <p><b>Solution:</b><br/>
             Sum of odd-placed digits (from right): 6 + 4 + 8 = 18<br/>
             Sum of even-placed digits (from right): 5 + 9 + 7 = 21<br/>
             Difference = 21 - 18 = 3<br/>
             Since the difference (3) is not 0 or a multiple of 11, the number is <b>not divisible by 11</b>.
          </p>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}