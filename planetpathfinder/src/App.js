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
  async function getAllTimePlanets(y, m, d, h, min, s){
    const result = await fetch("http://127.0.1:5000/getAnySigmaCords?y="+y+"&m="+m+"&d="+d+"&h="+h+"&min="+min+"&s="+s);
  }
  async function getOptimalPath() {
    const result = await fetch("http://127.0.0.1:5000/getPath", {
      method: 'POST',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify({'planets': selectedPlanets}),
    })
    const data = await result.json();
    return data
  
  }
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
  var initalSteps = ["freddy","freddy","freddy","freddy","freddy","freddy","freddy","freddy"];
  const [steps, setSteps] = useState(initalSteps);
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 5000); 
      return () => clearTimeout(timer);
    }
    getAllPlanets().then((data) => {
      for(var vals in planets) {
        if(planets[vals]["name"] !== "sun") {
          planets[vals]['cx'] = SUN_CX+data[planets[vals]["name"]][0]*35;
          planets[vals]['cy'] = SUN_CY+data[planets[vals]["name"]][1]*35;
        }
        
      }
      setPlanets(planets);
    })
    getOptimalPath().then((data) => {
        console.log(data)
        for(var i = 0; i<data.length; i++) {
          steps[i] = data[i][0] + "->"+data[i][1]+", " + data[i][3];
        }
        setSteps(steps);
      }
    )

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

  var [selectedPlanets, setSelectPlanet] = useState([]);
  
  const selectPlanets = (planet) => {
    const elements = document.getElementsByClassName(planet);
    if (elements.length > 0) {
      elements[0].classList.add('selected');
    }
    selectedPlanets.push(planet);
    setSelectPlanet(selectedPlanets);
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
          <button onClick={handleCloseOverlay}>Start Calculating!</button>
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
        <div className = "stepContainer">
          <div className = "step uno">
          {steps[0]}
          </div>
          <div className = "step dos">
          {steps[1]}

          </div>
          <div className = "step tres">
          {steps[2]}

          </div>
          <div className = "step quatro">
          {steps[3]}

          </div>
          <div className = "step cinco">
          {steps[4]}

          </div>
          <div className = "step seis">
          {steps[5]}

          </div>
          <div className = "step siete">
          {steps[6]}

          </div>
        </div>
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam cupiditate repudiandae quia a ipsa deserunt maxime nisi, vitae ipsam odio quidem distinctio doloremque voluptates officiis, numquam nihil molestiae perferendis hic.
              <br />
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam cupiditate repudiandae quia a ipsa deserunt maxime nisi, vitae ipsam odio quidem distinctio doloremque voluptates officiis, numquam nihil molestiae perferendis hic.
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

// PLANET 3D MODELS ------------------------------------------------------------------------------
function Sun(props) {
  const { nodes, materials } = useGLTF('/earth.glb')
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

function Mercury(props) {
  const { nodes, materials } = useGLTF('/mercury.glb')
  const group = useRef()
  useFrame( ({clock})=>{
    group.current.rotation.y = clock.getElapsedTime()/20
  })

  materials['Scene_-_Root'].map.anisotropy = 16;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes['Sphere001_Material_#50_0'].geometry} material={materials.Material_50} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

function Venus(props) {
  const { nodes, materials } = useGLTF('/venus.glb')
  const group = useRef()
  useFrame( ({clock})=>{
    group.current.rotation.y = clock.getElapsedTime()/20
  })

  materials['Scene_-_Root'].map.anisotropy = 16;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_2.geometry} material={materials.moon} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

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


function Mars(props) {
  const { nodes, materials } = useGLTF('/mars.glb')
  const group = useRef()
  useFrame( ({clock})=>{
    group.current.rotation.y = clock.getElapsedTime()/20
  })

  materials['Scene_-_Root'].map.anisotropy = 16;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_2.geometry} material={materials['Material.001']} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}


function Jupiter(props) {
  const { nodes, materials } = useGLTF('/jupiter.glb')
  const group = useRef()
  useFrame( ({clock})=>{
    group.current.rotation.y = clock.getElapsedTime()/20
  })

  materials['Scene_-_Root'].map.anisotropy = 16;
  return (
    <group {...props} dispose={null}>
    <mesh geometry={nodes.Jupiter_Planeta_0.geometry} material={materials.Planeta} rotation={[-Math.PI / 2, 0, 0]} />
    <mesh geometry={nodes.pierscien_Pierscien_0.geometry} material={materials.Pierscien} rotation={[-Math.PI / 2, 0, 0]} />
  </group>

  )
}


function Saturn(props) {
  const { nodes, materials } = useGLTF('/saturn.glb')
  const group = useRef()
  useFrame( ({clock})=>{
    group.current.rotation.y = clock.getElapsedTime()/20
  })

  materials['Scene_-_Root'].map.anisotropy = 16;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Sphere_Material002_0.geometry} material={materials['Material.002']} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      <mesh geometry={nodes.Circle_ring_0.geometry} material={materials.ring} rotation={[-Math.PI / 2, 0.236, 0]} scale={163.361} />
    </group>
  )
}


function Uranus(props) {
  const { nodes, materials, animations } = useGLTF('/uranus.glb')
  const { actions } = useAnimations(animations, group)
  const group = useRef()
  useFrame( ({clock})=>{
    group.current.rotation.y = clock.getElapsedTime()/20
  })

  materials['Scene_-_Root'].map.anisotropy = 16;
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="c1957ceccd8246adba02dfc94cd45727fbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Uranus" position={[0, 366.034, 0]} rotation={[Math.PI, 0, 0]} scale={100}>
                  <mesh name="Uranus_1_0" geometry={nodes.Uranus_1_0.geometry} material={materials.material} />
                </group>
                <group name="Uranus_clouds" position={[0, 366.034, 0]} rotation={[Math.PI, 0, 0]} scale={[101.44, 101.44, 102.903]}>
                  <mesh name="Uranus_clouds_2_0" geometry={nodes.Uranus_clouds_2_0.geometry} material={materials.material_1} />
                </group>
                <group name="Ring" rotation={[Math.PI, 0, 0]} scale={100}>
                  <mesh name="Ring_3_0" geometry={nodes.Ring_3_0.geometry} material={materials.material_2} />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}


function Neptune(props) {
  const { nodes, materials, animations } = useGLTF('/earth.glb')
  const group = useRef()
  const { actions } = useAnimations(animations, group)
  useFrame( ({clock})=>{
    group.current.rotation.y = clock.getElapsedTime()/20
  })

  materials['Scene_-_Root'].map.anisotropy = 16;
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="943e82ae1e91464bb6057ce325b1063bfbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Planeta" rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh name="Planeta_Planeta_0" geometry={nodes.Planeta_Planeta_0.geometry} material={materials.Planeta} />
                </group>
                <group name="Atmosfera" rotation={[-Math.PI / 2, 0, 0]} scale={1.005}>
                  <mesh name="Atmosfera_Atmosfera_0" geometry={nodes.Atmosfera_Atmosfera_0.geometry} material={materials.Atmosfera} />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}
// ---------------------------------------------------------------------------------------------------------------

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