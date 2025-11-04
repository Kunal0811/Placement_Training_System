// src/pages/Aptitude/Quant/TSDNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function TSDNotes() {
  const topic = "Time, Speed & Distance";
  const videos = [
    { url: "https://www.youtube.com/embed/vN7eJw-1MSM", title: "Time, Speed & Distance - Complete Concept" },
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      
      <NoteSection title="1. Conceptual Overview">
        <p>
          The concept of <b>Time, Speed, and Distance (TSD)</b> is one of the most fundamental topics in Quantitative Aptitude.  
          It is based on the relationship:
        </p>
        <p className="text-center font-semibold mt-2 text-lg bg-gray-700">Distance = Speed × Time</p>
        <p className="mt-2">
          - When two of the three quantities (Speed, Time, Distance) are known, the third can be easily calculated.<br/>
          - This topic is used to solve problems involving travel, trains, relative motion, and average speeds.
        </p>
      </NoteSection>

      <NoteSection title="2. Key Formulas">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Speed =</b> Distance / Time</li>
          <li><b>Time =</b> Distance / Speed</li>
          <li><b>Distance =</b> Speed × Time</li>
          <li><b>Conversion:</b> 1 km/hr = 5/18 m/s; 1 m/s = 18/5 km/hr</li>
          <li><b>Average Speed:</b> Total Distance / Total Time</li>
          <li><b>If equal distances are covered with speeds x and y:</b> Average Speed = (2xy) / (x + y)</li>
          <li><b>Relative Speed (Same Direction):</b> |s₁ - s₂|</li>
          <li><b>Relative Speed (Opposite Direction):</b> s₁ + s₂</li>
        </ul>
      </NoteSection>

      <NoteSection title="3. Important Concepts & Notes">
        <ul className="list-disc pl-5 space-y-2">
          <li>Speed and time are inversely proportional — if speed increases, time decreases for the same distance.</li>
          <li>When two objects move towards each other, their relative speed is the sum of their speeds.</li>
          <li>When two objects move in the same direction, their relative speed is the difference of their speeds.</li>
          <li>Always keep units consistent — if distance is in km and time in hours, speed must be in km/hr.</li>
        </ul>
      </NoteSection>

      <NoteSection title="4. Solved Examples">
        <h4 className="text-lg font-semibold text-neon-pink">Example 1: Basic Calculation</h4>
        <p className="italic"><b>Problem:</b> A car covers a distance of 150 km in 3 hours. Find its speed.</p>
        <p><b>Solution:</b><br/>
          Speed = Distance / Time = 150 / 3 = 50 km/hr.
        </p>

        <h4 className="text-lg font-semibold text-neon-pink pt-3">Example 2: Finding Time</h4>
        <p className="italic"><b>Problem:</b> A train runs at 60 km/hr. How much time will it take to cover 180 km?</p>
        <p><b>Solution:</b><br/>
          Time = Distance / Speed = 180 / 60 = 3 hours.
        </p>

        <h4 className="text-lg font-semibold text-neon-pink pt-3">Example 3: Conversion Between Units</h4>
        <p className="italic"><b>Problem:</b> Convert 72 km/hr into m/s.</p>
        <p><b>Solution:</b><br/>
          72 × (5/18) = 20 m/s.
        </p>

        <h4 className="text-lg font-semibold text-neon-pink pt-3">Example 4: Average Speed</h4>
        <p className="italic"><b>Problem:</b> A person goes from A to B at 60 km/hr and returns at 40 km/hr. Find the average speed.</p>
        <p><b>Solution:</b><br/>
          Average Speed = (2xy)/(x + y) = (2×60×40)/(60+40) = 4800/100 = 48 km/hr.
        </p>

        <h4 className="text-lg font-semibold text-neon-pink pt-3">Example 5: Relative Speed</h4>
        <p className="italic"><b>Problem:</b> Two trains are moving in opposite directions at 60 km/hr and 90 km/hr. Find the relative speed.</p>
        <p><b>Solution:</b><br/>
          Relative Speed = 60 + 90 = 150 km/hr.
        </p>
      </NoteSection>

      <NoteSection title="5. Shortcut Tricks & Tips">
        <ul className="list-disc pl-5 space-y-2">
          <li>If distance is constant, speed ∝ 1/time. So, (S₁ / S₂) = (T₂ / T₁)</li>
          <li>When one object starts later but still catches up, use relative speed to find the time gap.</li>
          <li>For trains crossing poles, platforms, or other trains — always use <b>Relative Speed</b> and <b>Total Distance</b> covered.</li>
          <li>If a vehicle travels different distances at different speeds, compute <b>Average Speed = Total Distance / Total Time</b>.</li>
        </ul>
      </NoteSection>

      <NoteSection title="6. Real-Life Applications">
        <p>
          - Used in travel and logistics for time estimation.<br/>
          - Helps compare performance speeds of vehicles.<br/>
          - Common in entrance exams like SSC, Banking, RRB, and CAT.
        </p>
      </NoteSection>
    </AptitudeNoteLayout>
  );
}
