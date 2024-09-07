import React from 'react';

const SolarSystem = () => {
  const planets = [
    { name: 'Mercury', cx: 50, cy: 50, r: 5 },
    { name: 'Venus', cx: 100, cy: 100, r: 10 },
    { name: 'Earth', cx: 150, cy: 150, r: 10 },
    { name: 'Mars', cx: 200, cy: 200, r: 8 },
    // Add other planets
  ];

  const handleMouseOver = (planet) => {
    console.log(`Hovered over ${planet.name}`);
  };

  const handleClick = (planet) => {
    alert(`Clicked on ${planet.name}`);
  };

  return (
    <svg width="400" height="400" style={{ border: '1px solid black' }}>
      <circle cx="200" cy="200" r="20" fill="yellow" />
      {planets.map((planet, index) => (
        <circle
          key={index}
          cx={planet.cx}
          cy={planet.cy}
          r={planet.r}
          fill="blue"
          onMouseOver={() => handleMouseOver(planet)}
          onClick={() => handleClick(planet)}
        />
      ))}
    </svg>
  );
};

function App() {
  return (
    <div>
      <h1>Planet Pathfinder</h1>
      <SolarSystem />
    </div>
  );
}

export default App;