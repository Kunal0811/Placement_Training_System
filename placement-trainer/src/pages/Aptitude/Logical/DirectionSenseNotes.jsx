// src/pages/Aptitude/Logical/DirectionSenseNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function DirectionSenseNotes() {
  const topic = "Direction Sense";
  const videos = [
    { url: "https://www.youtube.com/embed/AX9aUQW9fD8", title: "Direction Sense Tricks & Concepts" },
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>

      {/* Conceptual Overview */}
      <NoteSection title="1. Conceptual Overview">
        <p>
          Direction sense tests measure your ability to visualize movement, direction changes, 
          and relative positions in two-dimensional space. Typical questions describe a person's 
          movement (e.g., “A walks 10 m North, then 5 m East”), and you need to determine their 
          final position or direction relative to the starting point.
        </p>

        <h4 className="text-xl font-semibold text-neon-pink pt-3">Key Concepts</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>4 Cardinal Directions:</b> North, South, East, West.</li>
          <li><b>4 Intermediate (Ordinal) Directions:</b> North-East (NE), North-West (NW), South-East (SE), South-West (SW).</li>
          <li><b>Right Turn:</b> Clockwise rotation (e.g., from North → East).</li>
          <li><b>Left Turn:</b> Anti-clockwise rotation (e.g., from North → West).</li>
          <li><b>Angle Concept:</b> Each turn represents 90°, and opposite directions differ by 180°.</li>
          <li><b>Pythagoras Theorem:</b> Used to find the shortest distance between two points.  
            <br />Formula: <b>Distance = √(x² + y²)</b>
          </li>
        </ul>
      </NoteSection>

      {/* Diagrammatic Approach */}
      <NoteSection title="2. Diagrammatic Approach">
        <p>
          Always visualize or draw the directions before solving. You can follow this standard layout:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>At the top of the page: <b>North (↑)</b></li>
          <li>Bottom: <b>South (↓)</b></li>
          <li>Right side: <b>East (→)</b></li>
          <li>Left side: <b>West (←)</b></li>
        </ul>
        <p className="pt-2">Each movement is drawn accordingly — this helps avoid confusion when multiple turns occur.</p>
      </NoteSection>

      {/* Turning Logic */}
      <NoteSection title="3. Turning Logic Table">
        <table className="border border-gray-400 mt-2 text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="border border-gray-400 px-3 py-1">Current Direction</th>
              <th className="border border-gray-400 px-3 py-1">Turn Right</th>
              <th className="border border-gray-400 px-3 py-1">Turn Left</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border border-gray-400 px-3 py-1">North</td><td className="border border-gray-400 px-3 py-1">East</td><td className="border border-gray-400 px-3 py-1">West</td></tr>
            <tr><td className="border border-gray-400 px-3 py-1">East</td><td className="border border-gray-400 px-3 py-1">South</td><td className="border border-gray-400 px-3 py-1">North</td></tr>
            <tr><td className="border border-gray-400 px-3 py-1">South</td><td className="border border-gray-400 px-3 py-1">West</td><td className="border border-gray-400 px-3 py-1">East</td></tr>
            <tr><td className="border border-gray-400 px-3 py-1">West</td><td className="border border-gray-400 px-3 py-1">North</td><td className="border border-gray-400 px-3 py-1">South</td></tr>
          </tbody>
        </table>
      </NoteSection>

      {/* Solved Examples */}
      <NoteSection title="4. Solved Examples">
        <h4 className="text-lg font-semibold text-neon-pink pt-2">Example 1:</h4>
        <p><b>Statement:</b> A person walks 5 km North, then 3 km East. Find the shortest distance from the starting point.</p>
        <p><b>Solution:</b> The movement forms a right triangle with sides 5 and 3.<br />
          Using Pythagoras: √(5² + 3²) = √34 ≈ 5.83 km.  
          <br /><b>Answer:</b> 5.83 km towards North-East.
        </p>

        <h4 className="text-lg font-semibold text-neon-pink pt-3">Example 2:</h4>
        <p><b>Statement:</b> A person walks 10 m South, turns right, walks 5 m, turns right again, and walks 10 m. What is the direction now from the starting point?</p>
        <p><b>Solution:</b> The person ends up 5 m to the West of the starting point.  
        <b>Answer:</b> West direction.</p>

        <h4 className="text-lg font-semibold text-neon-pink pt-3">Example 3:</h4>
        <p><b>Statement:</b> A walks 4 km East, then 3 km North. What is the direction of A from the starting point?</p>
        <p><b>Answer:</b> North-East.</p>
      </NoteSection>

      {/* Shortcut Tricks */}
      <NoteSection title="5. Shortcut Tricks">
        <ul className="list-disc pl-5 space-y-2">
          <li>🔹 Always assume you start facing <b>North</b> unless stated otherwise.</li>
          <li>🔹 Right turn → Clockwise (N→E→S→W→N)</li>
          <li>🔹 Left turn → Anti-clockwise (N→W→S→E→N)</li>
          <li>🔹 Opposite directions differ by <b>180°</b>.</li>
          <li>🔹 Use Pythagoras for shortest path: <b>Distance = √(x² + y²)</b>.</li>
          <li>🔹 For rectangular movement → total displacement is the diagonal.</li>
          <li>🔹 Visualize each step with a diagram — accuracy increases 2x.</li>
        </ul>
      </NoteSection>

      {/* Practice Questions */}
      <NoteSection title="6. Practice Questions">
        <ol className="list-decimal pl-5 space-y-2">
          <li>A walks 5 km North, then 4 km East. How far and in what direction is A from the starting point?</li>
          <li>P walks 3 km West, then 4 km South. Find the shortest distance from the starting point.</li>
          <li>R starts facing North, turns right, walks 6 m, turns left, and walks 8 m. Find his final direction.</li>
          <li>Q walks 10 m East, turns right, and walks 5 m. How far is Q from the starting point?</li>
          <li>A person walks 4 km North, then 4 km East, then 4 km South. Find the direction and distance from the starting point.</li>
        </ol>
      </NoteSection>

    </AptitudeNoteLayout>
  );
}
