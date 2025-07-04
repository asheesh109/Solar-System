Solar System Simulation with Three.js
https://./public/preview.png

Overview
This 3D solar system simulation is built using Three.js to demonstrate realistic planetary motion and celestial visualization. The project features accurate orbital mechanics, atmospheric effects, and dynamic lighting in an interactive WebGL environment.

Key Features
Realistic planetary orbits with configurable speeds and directions

Multi-layered planet rendering (surface, atmosphere, city lights)

Dynamic sun effects with corona animations and light scattering

Interactive controls for zooming and adjusting simulation speeds

Theme switching between light and dark modes

Optimized performance using buffer geometries and shader materials

Technical Implementation
Core Architecture
The system uses a modular class-based design:

Planet.js - Base class handling orbital mechanics and basic rendering

Earth.js - Extended class with special atmospheric effects

Sun.js - Custom implementation with dynamic surface effects

Starfield.js - Background star generation

Dependencies
Three.js (v156+) - Core 3D rendering library

Vite - Build tool and development server

OrbitControls - Camera navigation

ImprovedNoise - Sun corona effects

Asset Sources
All planetary textures were sourced from:

Planetary Pixel Emporium (Primary textures)

Custom created ring and star textures

Getting Started
Installation
Clone the repository

Install dependencies:

bash
npm install
Running the Application
Start the development server:

bash
npm run dev
Build for production:

bash
npm run build
Configuration
Key parameters can be adjusted in:

src/planet.js (Orbital mechanics)

src/earth.js (Atmospheric effects)

src/sun.js (Lighting parameters)

Project Structure
text
solar-system/
├── public/              # Static assets
│   ├── textures/        # Planetary textures
│   └── preview.png
├── src/
│   ├── planet.js        # Base planet class
│   ├── earth.js         # Earth implementation
│   ├── sun.js           # Sun implementation  
│   ├── starfield.js     # Background stars
│   └── main.js          # Scene setup
├── package.json         # Project configuration
└── vite.config.js       # Build configuration
Customization
To add new planets:

Create a new class extending Planet.js

Configure orbital parameters and textures

Add to the scene in main.js

License
This project is open source and available under the MIT License.