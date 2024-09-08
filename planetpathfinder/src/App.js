import React, { useState, useEffect } from 'react';
import './app.css';

const SUN_CX = 762.5;
const SUN_CY = 367.5;

const MERCURY_ORBIT_RADIUS = 50;
const VENUS_ORBIT_RADIUS = 90;
const EARTH_ORBIT_RADIUS = 130;
const MARS_ORBIT_RADIUS = 170;
const JUPITER_ORBIT_RADIUS = 210;
const SATURN_ORBIT_RADIUS = 250;
const URANUS_ORBIT_RADIUS = 290;
const NEPTUNE_ORBIT_RADIUS = 330;

const getRandomAngle = () => Math.random() * 2 * Math.PI;

const getPlanetPosition = (orbitRadius) => {
  const angle = getRandomAngle();
  return {
    cx: SUN_CX + orbitRadius * Math.cos(angle),
    cy: SUN_CY + orbitRadius * Math.sin(angle),
  };
};

const SolarSystem = () => {
  const initialPlanets = [
    { name: 'Sun', cx: SUN_CX, cy: SUN_CY, r: 40, image: 'sun.png', orbitRadius: 0, duration: '0s' },
    { name: 'Mercury', ...getPlanetPosition(MERCURY_ORBIT_RADIUS), r: 5, image: 'mercury.png', orbitRadius: MERCURY_ORBIT_RADIUS, duration: '10s' },
    { name: 'Venus', ...getPlanetPosition(VENUS_ORBIT_RADIUS), r: 10, image: 'venus.png', orbitRadius: VENUS_ORBIT_RADIUS, duration: '20s' },
    { name: 'Earth', ...getPlanetPosition(EARTH_ORBIT_RADIUS), r: 10, image: 'earth.png', orbitRadius: EARTH_ORBIT_RADIUS, duration: '30s' },
    { name: 'Mars', ...getPlanetPosition(MARS_ORBIT_RADIUS), r: 8, image: 'mars.png', orbitRadius: MARS_ORBIT_RADIUS, duration: '40s' },
    { name: 'Jupiter', ...getPlanetPosition(JUPITER_ORBIT_RADIUS), r: 30, image: 'jupiter.png', orbitRadius: JUPITER_ORBIT_RADIUS, duration: '50s' },
    { name: 'Saturn', ...getPlanetPosition(SATURN_ORBIT_RADIUS), r: 25, image: 'saturn.png', orbitRadius: SATURN_ORBIT_RADIUS, duration: '60s' },
    { name: 'Uranus', ...getPlanetPosition(URANUS_ORBIT_RADIUS), r: 20, image: 'uranus.png', orbitRadius: URANUS_ORBIT_RADIUS, duration: '70s' },
    { name: 'Neptune', ...getPlanetPosition(NEPTUNE_ORBIT_RADIUS), r: 20, image: 'neptune.png', orbitRadius: NEPTUNE_ORBIT_RADIUS, duration: '80s' },
  ];

  const [planets, setPlanets] = useState(initialPlanets);
  const [loading, setLoading] = useState(false); 
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [overlayTransition, setOverlayTransition] = useState(false);
  const [planetTransition, setPlanetTransition] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 5000); 
      return () => clearTimeout(timer);
    }
  }, [loading]); 

  const orbits = [
    { name: "mercury orbit", cx: SUN_CX, cy: SUN_CY, r: MERCURY_ORBIT_RADIUS, color: 'white' },
    { name: "venus orbit", cx: SUN_CX, cy: SUN_CY, r: VENUS_ORBIT_RADIUS, color: 'white' },
    { name: "earth orbit", cx: SUN_CX, cy: SUN_CY, r: EARTH_ORBIT_RADIUS, color: 'white' },
    { name: "mars orbit", cx: SUN_CX, cy: SUN_CY, r: MARS_ORBIT_RADIUS, color: 'white' },
    { name: "jupiter orbit", cx: SUN_CX, cy: SUN_CY, r: JUPITER_ORBIT_RADIUS, color: 'white' },
    { name: "saturn orbit", cx: SUN_CX, cy: SUN_CY, r: SATURN_ORBIT_RADIUS, color: 'white' },
    { name: "uranus orbit", cx: SUN_CX, cy: SUN_CY, r: URANUS_ORBIT_RADIUS, color: 'white' },
    { name: "neptune orbit", cx: SUN_CX, cy: SUN_CY, r: NEPTUNE_ORBIT_RADIUS, color: 'white' },
  ];

  const handleClick = (clickedPlanet) => {
    setPlanets(
      planets.map((planet) =>
        planet.name === clickedPlanet.name && planet.name !== "Sun"
          ? { ...planet, duration: "5s" }
          : planet
      )
    );
  };

  const handleCloseOverlay = () => {
    setOverlayVisible(false);
    setLoading(true); 
    setPlanetTransition(true);
    setTimeout(() => setLoading(false),5000);
  };

  return (
    <div className="parent-container">
      {overlayVisible && (
        <div className="fullscreen-overlay">
          <button onClick={handleCloseOverlay}>Calculate!</button>
          <img src="earth.png"></img>
        </div>
      )}
      <div className="solar-system-container">
        {loading && <div className="loading-text">Calculating</div>}
        <svg
          className={`planet ${planetTransition ? 'planet-transition' : ''}`}
          width="100%"
          height="100%"
          viewBox="0 0 1525 735"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect width="100%" height="100%" fill="black" />
          {orbits.map((orbit, index) => (
            <circle
              key={index}
              cx={orbit.cx}
              cy={orbit.cy}
              r={orbit.r}
              fill="none"
              stroke={orbit.color}
              strokeWidth={1}
              strokeDasharray="5,5"
            />
          ))}
          {planets.map((planet, index) => (
            <image
              key={index}
              href={planet.image}
              x={planet.cx - planet.r}
              y={planet.cy - planet.r}
              width={planet.r * 2}
              height={planet.r * 2}
              onClick={() => handleClick(planet)}
              style={{
                animation: loading ? `orbit ${planet.duration} linear infinite` : 'none',
                transformOrigin: `${SUN_CX}px ${SUN_CY}px`,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

//BELOW IS ALL THE CODE FOR THE MAIN SECTION ====================================================================================
//BELOW IS ALL THE CODE FOR THE MAIN SECTION ====================================================================================
//BELOW IS ALL THE CODE FOR THE MAIN SECTION ====================================================================================

const MainPage = ({ loaded = true }) => {
  if (loaded) {
    return (
      <div className = "mainDiv">
        <div className = "rightDiv">
          <div className = "rounded-full border-4 border-black bg-blue-500 w-5/6 h-5/6 mr-24"> {/* Make 3d earth later */}
          {/* <Canvas shadows dpr={[1, 2]} camera={{ fov: 45 }}>
            <ambientLight intensity={5} />
            <directionalLight position={[5, 5, 5]} intensity={5} castShadow />
            <PresentationControls 
              speed={1.5} 
              global 
              zoom={1}
              polar={[-0.1, Math.PI / 4]}
            >
              <Stage environment={null}>
                <Earth scale={0.01} />
              </Stage>
            </PresentationControls>
          </Canvas> */}
          </div>
        </div>
        <div className = "leftDiv">
          <div className = "titleDiv">
            <p className = "title">Planet Pathfinder</p>
          </div>
          <div className = "flex mt-20 w-1/3 pl-24">
            <p className = "text-xl text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam cupiditate repudiandae quia a ipsa deserunt maxime nisi, vitae ipsam odio quidem distinctio doloremque voluptates officiis, numquam nihil molestiae perferendis hic.
              <br />
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam cupiditate repudiandae quia a ipsa deserunt maxime nisi, vitae ipsam odio quidem distinctio doloremque voluptates officiis, numquam nihil molestiae perferendis hic.
            </p>
          </div>
          <div className = "flex mt-20 w-1/3 pl-24">
              <a href="https://youtube.com" className = "border-purple-700 bg-purple-800 border-4 py-3 px-6 rounded-3xl text-white">Sigma</a>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-screen h-screen border-4 border-red-500 justify-center items-center">
      <p className="text-9xl">Planet Pathfinder</p>
    </div>
  );
};


//THE APP ITSELF

const App = () => {
  return (
    <div className = "classContainer">
      <section>
        <MainPage loaded = {true}/>
      </section>
      <section>
        <SolarSystem />
      </section>
    </div>

  )
}

export default App;