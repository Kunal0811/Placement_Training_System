import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ScoreDonutChart = ({ score }) => {
  let status, color;

  // --- NEW 5-LEVEL RANGES & COLORS ---
  // Based on your image and specific color requests
  if (score >= 80) {
    status = 'Excellent';
    color = '#39FF14'; // neon-green
  } else if (score >= 60) {
    status = 'Good';
    color = '#ADFF2F'; // Light Green (GreenYellow - fits "lower than green, more than yellow")
  } else if (score >= 40) {
    status = 'Average';
    color = '#FFFF33'; // neon-yellow
  } else if (score >= 20) {
    status = 'Poor';
    color = '#FFA500'; // Neon Orange
  } else {
    status = 'Bad';
    color = '#FF0000'; // Neon Red (Replaced pink as requested)
  }
  // --- END OF NEW RANGES ---

  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const COLORS = [color, '#374151']; // Active color, gray-700 for bg

  return (
    <div className="w-48 h-48 mx-auto relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* SVG filter for the neon glow effect on the arc */}
          <defs>
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="4.5"
                floodColor={color}
                floodOpacity="1"
              />
            </filter>
          </defs>

          {/* Gray background circle */}
          <Pie
            data={[{ value: 100 }]}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#374151" // gray-700
          />
          {/* Colored score arc */}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            stroke="none"
            // Apply the glow filter
            filter="url(#neon-glow)"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          
          {/* Center Text: Score */}
          <text
            x="50%"
            y="45%"
            textAnchor="middle"
            dominantBaseline="middle"
            // Use the text-glow class from your index.css
            className="text-4xl font-bold text-glow"
            fill="#FFFFFF"
          >
            {`${score}%`}
          </text>
          
          {/* Center Text: Status */}
          <text
            x="50%"
            y="65%"
            textAnchor="middle"
            dominantBaseline="middle"
            // Use the text-glow class from your index.css
            className="text-xl font-semibold text-glow"
            fill={color} // Use the dynamic color
          >
            {status}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreDonutChart;