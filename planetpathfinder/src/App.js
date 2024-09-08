import React, { useState, useEffect, Suspense, useRef} from 'react';
import './app.css';
import {Canvas , useFrame} from '@react-three/fiber'
import {OrbitControls, useGLTF, useAnimations} from '@react-three/drei'

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
async function getAllPlanets(){
  const result = await fetch("http://127.0.0.1:5000/getSigmaCoords");
  const data = await result.json();
  return data;
}
const getPlanetPosition = (orbitRadius) => {
  const angle = getRandomAngle();
  return {
    cx: SUN_CX + orbitRadius * Math.cos(angle),
    cy: SUN_CY + orbitRadius * Math.sin(angle),
  };
};

const SolarSystem = () => {
  const initialPlanets = [
    { name: 'sun', cx: SUN_CX, cy: SUN_CY, r: 40, image: 'sun.png', orbitRadius: 0, duration: '0s' },
    { name: 'mercury', ...getPlanetPosition(MERCURY_ORBIT_RADIUS), r: 5, image: 'mercury.png', orbitRadius: MERCURY_ORBIT_RADIUS, duration: '10s' },
    { name: 'venus', ...getPlanetPosition(VENUS_ORBIT_RADIUS), r: 10, image: 'venus.png', orbitRadius: VENUS_ORBIT_RADIUS, duration: '20s' },
    { name: 'earth', ...getPlanetPosition(EARTH_ORBIT_RADIUS), r: 10, image: 'earth.png', orbitRadius: EARTH_ORBIT_RADIUS, duration: '30s' },
    { name: 'mars', ...getPlanetPosition(MARS_ORBIT_RADIUS), r: 8, image: 'mars.png', orbitRadius: MARS_ORBIT_RADIUS, duration: '40s' },
    { name: 'jupiter barycenter',...getPlanetPosition(JUPITER_ORBIT_RADIUS), r: 30, image: 'jupiter.png', orbitRadius: JUPITER_ORBIT_RADIUS, duration: '50s' },
    { name: 'saturn barycenter', ...getPlanetPosition(SATURN_ORBIT_RADIUS), r: 25, image: 'saturn.png', orbitRadius: SATURN_ORBIT_RADIUS, duration: '60s' },
    { name: 'uranus barycenter', ...getPlanetPosition(URANUS_ORBIT_RADIUS), r: 20, image: 'uranus.png', orbitRadius: URANUS_ORBIT_RADIUS, duration: '70s' },
    { name: 'neptune barycenter',...getPlanetPosition(NEPTUNE_ORBIT_RADIUS), r: 20, image: 'neptune.png', orbitRadius: NEPTUNE_ORBIT_RADIUS, duration: '80s' },
  ];

  const [planets, setPlanets] = useState(initialPlanets);
  const [loading, setLoading] = useState(false); 
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [planetTransition, setPlanetTransition] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 5000); 
      return () => clearTimeout(timer);
    }
    getAllPlanets().then((data) => {
      for(var vals in planets) {
        if(planets[vals]["name"] !== "sun") {
          console.log(planets[vals]["name"]);
          planets[vals]['cx'] = SUN_CX+data[planets[vals]["name"]][0]*35;
          planets[vals]['cy'] = SUN_CY+data[planets[vals]["name"]][1]*35;
        }
        
      }
      setPlanets(planets)
      console.log('-------------')
    })

  }, [loading,planets]); 

  const orbits = [
    { name: "mercury", cx: SUN_CX, cy: SUN_CY, r: MERCURY_ORBIT_RADIUS, color: 'white' },
    { name: "venus", cx: SUN_CX, cy: SUN_CY, r: VENUS_ORBIT_RADIUS, color: 'white' },
    { name: "earth", cx: SUN_CX, cy: SUN_CY, r: EARTH_ORBIT_RADIUS, color: 'white' },
    { name: "mars", cx: SUN_CX, cy: SUN_CY, r: MARS_ORBIT_RADIUS, color: 'white' },
    { name: "jupiter barycenter",cx: SUN_CX, cy: SUN_CY, r: JUPITER_ORBIT_RADIUS, color: 'white' },
    { name: "saturn barycenter", cx: SUN_CX, cy: SUN_CY, r: SATURN_ORBIT_RADIUS, color: 'white' },
    { name: "uranus barycenter", cx: SUN_CX, cy: SUN_CY, r: URANUS_ORBIT_RADIUS, color: 'white' },
    { name: "neptune barycenter", cx: SUN_CX, cy: SUN_CY, r: NEPTUNE_ORBIT_RADIUS, color: 'white' },
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

  let selectedPlanets = ["temp","temp","temp","temp","temp","temp","temp","temp"];
  
  const selectPlanets = (planet) => {
    const elements = document.getElementsByClassName(planet);
    if (elements.length > 0) {
      elements[0].classList.add('selected');
    }
    switch (planet){
      case "mercury": selectedPlanets[0] = "mercury"; break;
      case "venus": selectedPlanets[1] = "venus"; break;
      case "earth": selectedPlanets[2] = "earth"; break;
      case "mars": selectedPlanets[3] = "mars"; break;
      case "jupiter": selectedPlanets[4] = "jupiter"; break;
      case "saturn": selectedPlanets[5] = "saturn"; break;
      case "uranus": selectedPlanets[6] = "uranus"; break;
      case "neptune": selectedPlanets[7] = "neptune"; break;
    }
    selectedPlanets = selectedPlanets.filter(x => x !== "temp");
  }

  return (
    <div className="parent-container">
      {overlayVisible && (
        <div className="fullscreen-overlay">
          <div className = "planet-container mercury">
            <img onClick={() => selectPlanets("mercury")} src="mercury.png"></img>
          </div>
          <div className = "planet-container venus">
            <img onClick={() => selectPlanets("venus")} src="venus.png"></img>
          </div>
          <div className = "planet-container earth">
          <img onClick={() => selectPlanets("earth")} src="earth.png"></img>
          </div>
          <div className = "planet-container mars">
            <img onClick={() => selectPlanets("mars")} src="mars.png"></img>
          </div>
          <div className = "planet-container jupiter">
            <img onClick={() => selectPlanets("jupiter")} src="jupiter.png"></img>
          </div>
          <div className = "planet-container saturn">
            <img className = "saturn" onClick={() => selectPlanets("saturn")} src="saturn.png"></img>
          </div>
          <div className = "planet-container uranus">
            <img onClick={() => selectPlanets("uranus")} src="uranus.png"></img>
          </div>
          <div className = "planet-container neptune">
            <img onClick={() => selectPlanets("neptune")} src="neptune.png"></img>
          </div>
          <button className = "calculateB" onClick={handleCloseOverlay}>Start Calculating!</button>
          {/* <img onClick={() => selectPlanets("earth")} src="earth.png"></img> */}
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
        {!loading && <div className="stepContainer">
          <div className = "step uno">

          </div>
          <div className = "step dos">

          </div>
          <div className = "step tres">

          </div>
          <div className = "step quatro">

          </div>
          <div className = "step cinco">

          </div>
          <div className = "step seis">

          </div>
          <div className = "step siete">

          </div>
        </div>}
      </div>
    </div>
  );
};

const MainPage = ({ loaded = true }) => {
  if (loaded) {
    return (
      <div className = "mainDiv">
        <div className = "stars"></div>
        <div className="custom-shape-divider-bottom-1725778629">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
          </svg>
        </div>
        <div className = "rightDiv">
          <div className = "earthDiv">
            <Canvas className = "earthModel" camera = {{ fov:70, position: [0,0,15] }}>
              <Suspense fallback={null}>
                <ambientLight />
                <directionalLight intensity={2} position={[0,0,90]} />
                <Earth />
                <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} />
              </Suspense>
            </Canvas>
            <p className = "earthText">Drag to spin!</p>
          </div>
        </div>
        <div className = "leftDiv">
          <div className = "titleDiv">
            <p className = "title">Planet Pathfinder</p>
          </div>
          <div className = "textDiv">
            <p>
              <span className = "name">Planet Pathfinder</span> is a web application that's designed to optimize space exploration by <span className = "underline">calculating the most efficient pathing for visiting multiple planets</span>. This is built with a complex algorithm that determines the optimal <span className = "underline">date</span>, <span className = "underline">time</span>, and the <span className = "underline">sequence of planetary visits</span> in order to minimize fuel consumption and maximize travel efficiency.
              <br />
              <br />
              Using <span className = "name">Planet Pathfinder</span> is very simple. It is accessible to anyone who wishes to plan an interstellar voyage. You first click on the planets you wish to visit, and then click 'Start Calculating!'. This allows for easy use and the graphics are simple and convey all the information that the user needs.
            </p>
          </div>
          <div className = "startDiv">
              <a onClick={() => document.getElementById('solarSystem').scrollIntoView()} className = "startButton">Start!</a>
          </div>
        </div>
      </div>
    ); 
  }
};


function Earth(props) {
  const { nodes, materials } = useGLTF('3dmodels/earth.glb')
  const group = useRef()
  useFrame( ({clock})=>{
    group.current.rotation.y = clock.getElapsedTime()/20
  })

  materials['Scene_-_Root'].map.anisotropy = 16;
  return (
    <group ref ={group} {...props} dispose={null}>
      <mesh geometry={nodes.Object_4.geometry} material={materials['Scene_-_Root']} scale={7} />
    </group>
  )
}


function App() {
  return (
    <div className = "classContainer">
      <section id = "titleScreen">
        <MainPage loaded = {true}/>
      </section>
      <section id = "solarSystem">
        <SolarSystem />
      </section>
    </div>
  )
}

export default App;