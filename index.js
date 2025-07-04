import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  LinearSRGBColorSpace,
  ACESFilmicToneMapping,
  Raycaster,
  Vector2,
  Vector3,
  Color,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Sun } from "./src/sun";
import { Earth } from "./src/earth";
import { Planet } from "./src/planet";
import { Starfield } from "./src/starfield";


const w = window.innerWidth;
const h = window.innerHeight;

const scene = new Scene();
const camera = new PerspectiveCamera(75, w / h, 0.1, 100);
const renderer = new WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement);

const initialCamPos = new Vector3(30, 20, 40);
const initialCamTarget = new Vector3(0, 0, 0);

camera.position.copy(initialCamPos);
controls.target.copy(initialCamTarget);
controls.update();

renderer.setSize(w, h);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputColorSpace = LinearSRGBColorSpace;
document.body.appendChild(renderer.domElement);

// Track current theme
let currentTheme = 'dark';

const sun = new Sun().getSun();
sun.userData = { name: "Sun", planetSize: 5, orbitSpeed: 0 };
scene.add(sun);

const earth = new Earth({
  name: "Earth",
  orbitSpeed: 0.00029,
  orbitRadius: 16,
  orbitRotationDirection: "clockwise",
  planetSize: 0.5*1.5,
  planetAngle: (-23.4 * Math.PI) / 180,
  planetRotationSpeed: 0.01,
  planetRotationDirection: "counterclockwise",
  planetTexture: "./assets/earth-map.jpg",
}).getPlanet();
earth.userData = { name: "Earth", planetSize: 0.5, orbitSpeed: 0.00029 };
scene.add(earth);

const planetsData = [
  {
    name: "Mercury",
    orbitSpeed: 0.00048,
    orbitRadius: 10,
    planetSize: 0.3,
    planetRotationSpeed: 0.005,
    planetRotationDirection: "counterclockwise",
    orbitRotationDirection: "clockwise",
    planetTexture: "./assets/mercury-map.jpg",
    rimHex: 0xf9cf9f,
  },
  {
    name: "Venus",
    orbitSpeed: 0.00035,
    orbitRadius: 13,
    planetSize: 0.75,
    planetRotationSpeed: 0.0005,
    planetRotationDirection: "clockwise",
    orbitRotationDirection: "clockwise",
    planetTexture: "./assets/venus-map.jpg",
    rimHex: 0xb66f1f,
  },
  {
    name: "Mars",
    orbitSpeed: 0.00024,
    orbitRadius: 19,
    planetSize: 0.45,
    planetRotationSpeed: 0.01,
    planetRotationDirection: "counterclockwise",
    orbitRotationDirection: "clockwise",
    planetTexture: "./assets/mars-map.jpg",
    rimHex: 0xbc6434,
  },
  {
    name: "Jupiter",
    orbitSpeed: 0.00013,
    orbitRadius: 23,
    planetSize: 1.5,
    planetRotationSpeed: 0.06,
    planetRotationDirection: "counterclockwise",
    orbitRotationDirection: "clockwise",
    planetTexture: "./assets/jupiter-map.jpg",
    rimHex: 0xf3d6b6,
  },
  {
    name: "Saturn",
    orbitSpeed: 0.0001,
    orbitRadius: 28,
    planetSize: 1.2,
    planetRotationSpeed: 0.05,
    planetRotationDirection: "counterclockwise",
    orbitRotationDirection: "clockwise",
    planetTexture: "./assets/saturn-map.jpg",
    rimHex: 0xd6b892,
    rings: {
      ringsSize: 0.5,
      ringsTexture: "./assets/saturn-rings.jpg",
    },
  },
  {
    name: "Uranus",
    orbitSpeed: 0.00007,
    orbitRadius: 33,
    planetSize: 0.75,
    planetRotationSpeed: 0.02,
    planetRotationDirection: "clockwise",
    orbitRotationDirection: "clockwise",
    planetTexture: "./assets/uranus-map.jpg",
    rimHex: 0x9ab6c2,
    rings: {
      ringsSize: 0.4,
      ringsTexture: "./assets/uranus-rings.jpg",
    },
  },
  {
    name: "Neptune",
    orbitSpeed: 0.000054,
    orbitRadius: 36,
    planetSize: 0.75,
    planetRotationSpeed: 0.02,
    planetRotationDirection: "counterclockwise",
    orbitRotationDirection: "clockwise",
    planetTexture: "./assets/neptune-map.jpg",
    rimHex: 0x5c7ed7,
  },
];

const planetObjects = [sun, earth];
const originalSpeeds = { Sun: 0, Earth: 0.00029 };

planetsData.forEach((item) => {
  const planet = new Planet(item).getPlanet();
  planet.userData = {
    name: item.name,
    planetSize: item.planetSize,
    orbitSpeed: item.orbitSpeed || 0,
    orbitRotationDirection: item.orbitRotationDirection || "clockwise",
  };
  planetObjects.push(planet);
  originalSpeeds[item.name] = item.orbitSpeed;
  scene.add(planet);
});

const starfield = new Starfield().getStarfield();
scene.add(starfield);

const clickableMeshes = [];
function collectMeshes(obj) {
  if (obj.isMesh) clickableMeshes.push(obj);
  obj.children.forEach(collectMeshes);
}
planetObjects.forEach(collectMeshes);

const raycaster = new Raycaster();
const mouse = new Vector2();

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener("click", (e) => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableMeshes, false);
  if (intersects.length > 0) {
    const planet = findParentPlanet(intersects[0].object);
    if (planet) zoomToPlanet(planet);
  }
});

function findParentPlanet(obj) {
  while (obj && !obj.userData?.name) obj = obj.parent;
  return obj;
}

function zoomToPlanet(planet) {
  const planetPos = new Vector3();
  planet.getWorldPosition(planetPos);
  const size = planet.userData.planetSize || 0.5;

  let targetPos;

  if (planet.userData.name === "Sun") {
    const zoomDist = size * 4;
    targetPos = planetPos.clone().add(new Vector3(0, 0, zoomDist));
  } else {
    const sunPos = new Vector3();
    sun.getWorldPosition(sunPos);

    const sunDir = planetPos.clone().sub(sunPos).normalize();
    const oppositeDir = sunDir.clone().negate();

    const zoomDist = Math.max(size * 6, 3);
    targetPos = planetPos.clone().addScaledVector(oppositeDir, zoomDist);
  }

  animateCameraTo(targetPos, planetPos);
}

function animateCameraTo(target, lookAt) {
  const start = camera.position.clone();
  const startLook = controls.target.clone();
  const duration = 1200;
  const startTime = Date.now();
  controls.enabled = false;

  function animate() {
    const t = Math.min(1, (Date.now() - startTime) / duration);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    camera.position.lerpVectors(start, target, ease);
    controls.target.lerpVectors(startLook, lookAt, ease);
    controls.update();
    if (t < 1) requestAnimationFrame(animate);
    else controls.enabled = true;
  }
  animate();
}

const planetControlsContainer = document.getElementById("planet-controls");
planetObjects.forEach((p) => {
  const name = p.userData.name;
  if (name === "Sun") return;
  const div = document.createElement("div");
  div.className = "planet-control";
  div.innerHTML = `
    <label>${name}</label>
    <div class="speed-slider">
      <input type="range" min="0" max="10" step="0.1" value="1" data-planet="${name}" />
      <span class="speed-value">1.0x</span>
    </div>
  `;
  const slider = div.querySelector("input");
  const valSpan = div.querySelector(".speed-value");
  slider.addEventListener("input", (e) => {
    const m = parseFloat(e.target.value);
    p.userData.orbitSpeed = originalSpeeds[name] * m;
    valSpan.textContent = m.toFixed(1) + "x";
  });
  planetControlsContainer.appendChild(div);
});

// Control panel toggle with proper scrolling
document.getElementById("toggle-panel").addEventListener("click", (e) => {
  e.stopPropagation();
  const panelContent = document.querySelector(".panel-content");
  panelContent.classList.toggle("expanded");
  
  // Force reflow to ensure smooth transition
  if (panelContent.classList.contains("expanded")) {
    panelContent.style.overflowY = "hidden";
    void panelContent.offsetHeight; // Trigger reflow
    panelContent.style.overflowY = "auto";
  }
});

// Prevent panel from closing when clicking inside
document.querySelector(".panel-content").addEventListener("click", (e) => {
  e.stopPropagation();
});

let isPaused = false;
document.getElementById("pause-resume").addEventListener("click", (e) => {
  isPaused = !isPaused;
  e.target.textContent = isPaused ? "Resume" : "Pause";
});

document.getElementById("reset-speeds").addEventListener("click", () => {
  planetObjects.forEach((p) => {
    const name = p.userData.name;
    if (originalSpeeds[name] !== undefined) {
      p.userData.orbitSpeed = originalSpeeds[name];
      const slider = planetControlsContainer.querySelector(`input[data-planet="${name}"]`);
      if (slider) {
        slider.value = "1";
        slider.nextElementSibling.textContent = "1.0x";
      }
    }
  });
});

document.getElementById("reset-view").addEventListener("click", () => {
  animateCameraTo(initialCamPos, initialCamTarget);
});

// Theme Toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  const isLight = currentTheme === 'light';
  
  if (isLight) {
    scene.background = new Color(0xD3D3D3);
  } else {
    scene.background = new Color(0x000000);
  }
  
  if (starfield && typeof starfield.setTheme === "function") {
    starfield.setTheme(currentTheme);
  }

  planetObjects.forEach((planet) => {
    if (typeof planet.setTheme === "function") {
      planet.setTheme(currentTheme);
    }
  });

  updateUITheme(isLight);

  const themeBtn = document.getElementById("toggle-theme");
  themeBtn.textContent = isLight ? "Dark Mode" : "Light Mode";
});

function updateUITheme(isLight) {
  const root = document.documentElement;
  
  if (isLight) {
    root.style.setProperty('--bg-color', 'rgba(255, 255, 255, 0.9)');
    root.style.setProperty('--text-color', '#333333');
    root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.2)');
    root.style.setProperty('--button-bg', 'rgba(0, 0, 0, 0.1)');
    root.style.setProperty('--button-hover', 'rgba(0, 0, 0, 0.2)');
    root.style.setProperty('--tooltip-bg', 'rgba(255, 255, 255, 0.9)');
    root.style.setProperty('--tooltip-text', '#333333');
    root.style.setProperty('--panel-bg', 'rgba(255, 255, 255, 0.9)');
    root.style.setProperty('--panel-border', 'rgba(0, 0, 0, 0.2)');
  } else {
    root.style.setProperty('--bg-color', 'rgba(0, 0, 0, 0.7)');
    root.style.setProperty('--text-color', 'white');
    root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
    root.style.setProperty('--button-bg', 'rgba(255, 255, 255, 0.1)');
    root.style.setProperty('--button-hover', 'rgba(255, 255, 255, 0.2)');
    root.style.setProperty('--tooltip-bg', 'rgba(0, 0, 0, 0.8)');
    root.style.setProperty('--tooltip-text', 'white');
    root.style.setProperty('--panel-bg', 'rgba(0, 0, 0, 0.7)');
    root.style.setProperty('--panel-border', 'rgba(255, 255, 255, 0.1)');
  }
}

updateUITheme(false);

const tooltipEl = document.getElementById("tooltip");
function updateTooltip() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableMeshes, false);
  if (intersects.length > 0) {
    const planet = findParentPlanet(intersects[0].object);
    if (planet) {
      tooltipEl.style.display = "block";
      tooltipEl.textContent = `${planet.userData.name} (Click to zoom)`;
      tooltipEl.style.left = `${(mouse.x + 1) / 2 * window.innerWidth + 15}px`;
      tooltipEl.style.top = `${(-mouse.y + 1) / 2 * window.innerHeight + 15}px`;
      return;
    }
  }
  tooltipEl.style.display = "none";
}

window.addEventListener("resize", () => {
  const w2 = window.innerWidth, h2 = window.innerHeight;
  renderer.setSize(w2, h2);
  camera.aspect = w2 / h2;
  camera.updateProjectionMatrix();
});

const animate = () => {
  requestAnimationFrame(animate);
  if (!isPaused) {
    planetObjects.forEach((p) => {
      const dir = p.userData.orbitRotationDirection;
      if (dir === "clockwise") p.rotation.y -= p.userData.orbitSpeed;
      else if (dir === "counterclockwise") p.rotation.y += p.userData.orbitSpeed;
    });
  }
  controls.update();
  updateTooltip();
  renderer.render(scene, camera);
};
animate();