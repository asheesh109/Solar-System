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

---


## 🧪 Running the Application (Development)

Start the development server with hot reload:

```bash
npm run dev
```

---

## 📦 Building for Production

Create an optimized production build:

```bash
npm run build
```

---

## ⚙️ Configuration

You can customize the core simulation settings in the following files:

| File            | Configurable Parameters               |
|------------------|----------------------------------------|
| `src/planet.js` | Orbital mechanics, planet sizes        |
| `src/earth.js`  | Cloud layers, glow, atmospheric effects|
| `src/sun.js`    | Lighting, color intensity, shaders     |

---

## 🧩 Project Structure

```
solar-system/
├── public/              # Static assets
│   ├── textures/        # Planetary textures
│   └── preview.png      # Project preview image
├── src/
│   ├── planet.js        # Base planet class
│   ├── earth.js         # Earth with clouds and glow
│   ├── sun.js           # Sun with shader effects
│   ├── starfield.js     # Background starfield generation
│   └── main.js          # Scene and renderer setup
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite build and dev config
```

---

## 🌍 Adding New Planets

To add a new planet:

1. **Create a new file** (e.g., `mars.js`) and extend the `Planet` class.
2. **Define orbital properties** like radius, speed, and texture.
3. **Import and include it** in the scene via `main.js`.

### 🧩 Example

```js
// mars.js
import { Planet } from './planet.js';

export class Mars extends Planet {
  constructor(props) {
    super({ ...props, name: "Mars", texture: "mars.jpg", ... });
  }
}
```

```js
// main.js
import { Mars } from './mars.js';

const mars = new Mars({ orbitRadius: 60, orbitSpeed: 0.02 });
scene.add(mars.mesh);
```

---

## 📄 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and share it for personal or educational purposes.

---

## 🙌 Acknowledgements

- [Three.js](https://threejs.org/) – The core 3D engine powering the simulation  
- [Planet Pixel Emporium](http://planetpixelemporium.com/) – High-quality planetary textures  
- All contributors and open-source tools involved

---


> If you like this project, don’t forget to ⭐ star the repository!
