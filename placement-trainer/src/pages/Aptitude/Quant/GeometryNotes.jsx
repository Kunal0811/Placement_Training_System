// src/pages/Aptitude/Quant/GeometryNotes.jsx
import React from 'react';
import { AptitudeNoteLayout, NoteSection } from '../AptitudeNoteLayout';

export default function GeometryNotes() {
  const topic = "Geometry & Mensuration";
  const videos = [
    { url: "https://www.youtube.com/embed/DJYQfBuoWvY", title: "Mensuration Formulas - Complete Concepts" },
  ];

  return (
    <AptitudeNoteLayout title={topic} topic={topic} videos={videos}>
      
      <NoteSection title="1. Concept Overview">
        <p>
          <b>Geometry</b> deals with the properties and relations of points, lines, surfaces, and solids.  
          <b>Mensuration</b> focuses on measuring lengths, areas, and volumes of various shapes.
        </p>
        <p className="mt-2">
          Understanding both is essential for solving problems involving <i>distance, area, perimeter, surface area, and volume</i>.
        </p>
      </NoteSection>

      <NoteSection title="2. Basic Geometrical Terms">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Point:</b> Represents a location, has no size or dimension.</li>
          <li><b>Line:</b> Has length but no thickness, extends infinitely in both directions.</li>
          <li><b>Angle:</b> Formed when two lines meet at a common point (measured in degrees).</li>
          <li><b>Polygon:</b> A closed 2D figure made of straight lines (e.g., triangle, square, pentagon).</li>
        </ul>
      </NoteSection>

      <NoteSection title="3. 2D Shapes & Their Formulas">
        <h4 className="text-lg font-semibold text-neon-pink mt-2">Triangles</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Area = ½ × base × height</li>
          <li>Perimeter = a + b + c</li>
          <li>Area (using Heron’s Formula) = √[s(s−a)(s−b)(s−c)] where s = (a + b + c)/2</li>
          <li>Equilateral Triangle: Area = (√3 / 4) × a²</li>
        </ul>

        <h4 className="text-lg font-semibold text-neon-pink mt-4">Rectangle</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Area = length × breadth</li>
          <li>Perimeter = 2(l + b)</li>
          <li>Diagonal = √(l² + b²)</li>
        </ul>

        <h4 className="text-lg font-semibold text-neon-pink mt-4">Square</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Area = side²</li>
          <li>Perimeter = 4 × side</li>
          <li>Diagonal = √2 × side</li>
        </ul>

        <h4 className="text-lg font-semibold text-neon-pink mt-4">Circle</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Area = πr²</li>
          <li>Circumference = 2πr</li>
          <li>Diameter = 2r</li>
        </ul>

        <h4 className="text-lg font-semibold text-neon-pink mt-4">Parallelogram & Trapezium</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Parallelogram: Area = base × height</li>
          <li>Trapezium: Area = ½ × (sum of parallel sides) × height</li>
        </ul>
      </NoteSection>

      <NoteSection title="4. 3D Shapes & Their Formulas">
        <h4 className="text-lg font-semibold text-neon-pink mt-2">Cuboid</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Volume = l × b × h</li>
          <li>Total Surface Area (TSA) = 2(lb + bh + hl)</li>
          <li>Lateral Surface Area (LSA) = 2h(l + b)</li>
        </ul>

        <h4 className="text-lg font-semibold text-neon-pink mt-4">Cube</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Volume = a³</li>
          <li>TSA = 6a²</li>
          <li>LSA = 4a²</li>
        </ul>

        <h4 className="text-lg font-semibold text-neon-pink mt-4">Cylinder</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Volume = πr²h</li>
          <li>TSA = 2πr(h + r)</li>
          <li>Curved Surface Area (CSA) = 2πrh</li>
        </ul>

        <h4 className="text-lg font-semibold text-neon-pink mt-4">Cone</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Volume = (1/3)πr²h</li>
          <li>Slant Height = √(r² + h²)</li>
          <li>CSA = πrl</li>
          <li>TSA = πr(l + r)</li>
        </ul>

        <h4 className="text-lg font-semibold text-neon-pink mt-4">Sphere</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Volume = (4/3)πr³</li>
          <li>Surface Area = 4πr²</li>
        </ul>

        <h4 className="text-lg font-semibold text-neon-pink mt-4">Hemisphere</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Volume = (2/3)πr³</li>
          <li>CSA = 2πr²</li>
          <li>TSA = 3πr²</li>
        </ul>
      </NoteSection>

      <NoteSection title="5. Solved Examples">
        <p><b>Example 1:</b> Find the area of a circle whose radius is 7 cm.</p>
        <p>Area = πr² = 22/7 × 7 × 7 = 154 cm²</p>

        <p className="mt-3"><b>Example 2:</b> Find the volume of a cylinder of radius 5 cm and height 10 cm.</p>
        <p>Volume = πr²h = 3.14 × 25 × 10 = 785 cm³</p>

        <p className="mt-3"><b>Example 3:</b> Find the surface area of a cube with side 6 cm.</p>
        <p>TSA = 6a² = 6 × 36 = 216 cm²</p>
      </NoteSection>

      <NoteSection title="6. Shortcut Tricks & Conversions">
        <ul className="list-disc pl-5 space-y-2">
          <li>π = 22/7 or 3.14 (approx.)</li>
          <li>1 m = 100 cm = 1000 mm</li>
          <li>1 cm³ = 1 mL</li>
          <li>For quick recall — <b>Area increases with square, Volume with cube</b>.</li>
          <li>Always keep units consistent (cm, m, etc.).</li>
        </ul>
      </NoteSection>

      <NoteSection title="7. Real-Life Applications">
        <p>
          - Used in architecture, construction, and design.<br/>
          - Volume calculation for tanks, pipes, and containers.<br/>
          - Area measurement for flooring, painting, and fencing.<br/>
          - Fundamental in physics, engineering, and CAD modeling.
        </p>
      </NoteSection>

    </AptitudeNoteLayout>
  );
}
