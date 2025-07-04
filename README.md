# 🌌 Solar System Simulation with Three.js

![Preview](https://./public/preview.png)

A realistic and interactive 3D simulation of our solar system built using **Three.js**, featuring orbital mechanics, atmospheric effects, dynamic lighting, and responsive camera controls. This project is designed for educational and visual exploration of planetary motion in a WebGL-powered environment.

---

## 🚀 Overview

This simulation showcases the beauty of our solar system with:

- Realistic planetary orbits
- Dynamic sun effects
- Layered planet rendering (surface, clouds, city lights)
- Interactive controls and theme switching
- Optimized 3D performance using shaders and buffer geometries

---

## ✨ Key Features

✅ Realistic **planetary orbits** with configurable speed & direction  
✅ Multi-layered planet rendering (**surface, atmosphere, city lights**)  
✅ **Dynamic sun effects** with corona animations and light scattering  
✅ **Zoom, pan, and rotate** via OrbitControls  
✅ **Light/Dark mode** theme toggle  
✅ Optimized using **buffer geometries** & **shader materials**  
✅ Expandable to include more celestial bodies

---

## 🛠️ Technical Implementation

### 🔧 Core Architecture

The simulation uses a modular, class-based system:

| File          | Description                                   |
|---------------|-----------------------------------------------|
| `planet.js`   | Base class for planets (handles orbit, mesh)  |
| `earth.js`    | Extends Planet with clouds and atmosphere     |
| `sun.js`      | Sun rendering with custom shaders and light   |
| `starfield.js`| Star background using particles               |
| `main.js`     | Initializes scene, renderer, and camera       |

---

## 📦 Dependencies

- [Three.js (v0.156+)](https://threejs.org/)
- [Vite](https://vitejs.dev/) – Build tool & dev server
- `OrbitControls` – Camera interaction
- `ImprovedNoise` – Shader noise for sun’s corona

---

## 🖼️ Asset Sources

- Planetary Textures: [Planetary Pixel Emporium](http://planetpixelemporium.com/)
- Custom Ring and Star Textures (public domain)

---

## 🧑‍💻 Getting Started

### 🔄 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/solar-system-threejs.git
cd solar-system-threejs
npm install


🧪 Running the Application (Development)
bash
Copy
Edit
npm run dev
📦 Building for Production
bash
Copy
Edit
npm run build
⚙️ Configuration
Modify the following files to customize:

File	Configurable Parameters
src/planet.js	Orbital mechanics, sizes
src/earth.js	Clouds, glow, atmosphere layers
src/sun.js	Light color, intensity, shaders

🧩 Project Structure
csharp
Copy
Edit
solar-system/
├── public/              # Static assets
│   ├── textures/        # Planetary textures
│   └── preview.png
├── src/
│   ├── planet.js        # Base planet class
│   ├── earth.js         # Earth with atmosphere
│   ├── sun.js           # Sun with shaders
│   ├── starfield.js     # Star background
│   └── main.js          # Entry point (scene setup)
├── package.json         # NPM dependencies
└── vite.config.js       # Vite config
🌍 Adding New Planets
Create a new file, e.g., mars.js, and extend the Planet class.

Define its orbital radius, speed, and texture.

Import and add it in main.js.

Example:

js
Copy
Edit
import { Mars } from './mars.js';
const mars = new Mars({ ... });
scene.add(mars.mesh);
📄 License
This project is open-source and available under the MIT License.
Feel free to modify and use it for educational or personal projects.

🙌 Acknowledgements
Three.js

Planet Pixel Emporium


If you like this project, don't forget to ⭐ star the repo!
