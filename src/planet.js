import {
  Mesh,
  Color,
  Group,
  DoubleSide,
  RingGeometry,
  TorusGeometry,
  TextureLoader,
  ShaderMaterial,
  SRGBColorSpace,
  AdditiveBlending,
  MeshPhongMaterial,
  MeshBasicMaterial,
  IcosahedronGeometry,
} from "three";

export class Planet {
  group;
  loader;
  animate;
  planetGroup;
  planetGeometry;
  orbitMesh;
  currentTheme = 'dark';

  constructor({
    name = "Planet",
    orbitSpeed = 1,
    orbitRadius = 1,
    orbitRotationDirection = "clockwise",

    planetSize = 1,
    planetAngle = 0,
    planetRotationSpeed = 1,
    planetRotationDirection = "clockwise",
    planetTexture = "./assets/mercury-map.jpg",

    rimHex = 0x0088ff,
    facingHex = 0x000000,

    rings = null,
  } = {}) {
    this.name = name;
    this.orbitSpeed = orbitSpeed;
    this.orbitRadius = orbitRadius;
    this.orbitRotationDirection = orbitRotationDirection;

    this.planetSize = planetSize;
    this.planetAngle = planetAngle;
    this.planetTexture = planetTexture;
    this.planetRotationSpeed = planetRotationSpeed;
    this.planetRotationDirection = planetRotationDirection;

    this.rings = rings;

    this.group = new Group();
    this.planetGroup = new Group();
    this.loader = new TextureLoader();
    this.planetGeometry = new IcosahedronGeometry(this.planetSize, 12);

    
    this.group.userData = {
      name: this.name,
      orbitSpeed: this.orbitSpeed,
      orbitRotationDirection: this.orbitRotationDirection,
      planetSize: this.planetSize,
    };

    
    this.planetGroup.userData = {
      name: this.name,
      planetSize: this.planetSize,
    };

    this.createOrbit();
    this.createRings();
    this.createPlanet();
    this.createGlow(rimHex, facingHex);

    
    this.group.setTheme = (theme) => this.setTheme(theme);

    this.animate = this.createAnimateFunction();
    this.animate();
  }

  createOrbit() {
    const orbitGeometry = new TorusGeometry(this.orbitRadius, 0.01, 100);
    const orbitMaterial = new MeshBasicMaterial({
      color: 0xadd8e6,
      side: DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    this.orbitMesh = new Mesh(orbitGeometry, orbitMaterial);
    this.orbitMesh.rotation.x = Math.PI / 2;
    this.orbitMesh.userData.isOrbit = true;
    this.group.add(this.orbitMesh);
  }

  createPlanet() {
    const map = this.loader.load(this.planetTexture);
    const planetMaterial = new MeshPhongMaterial({ 
      map,
      specular: new Color(0x111111),
      shininess: 5,
      emissive: new Color(0x000000),
      emissiveIntensity: 0.1
    });
    planetMaterial.map.colorSpace = SRGBColorSpace;
    const planetMesh = new Mesh(this.planetGeometry, planetMaterial);
    
    
    planetMesh.userData = {
      name: this.name,
      planetSize: this.planetSize,
      isPlanet: true,
    };
    
    this.planetGroup.add(planetMesh);
    this.planetGroup.position.x = this.orbitRadius - this.planetSize / 9;
    this.planetGroup.rotation.z = this.planetAngle;
    this.group.add(this.planetGroup);
  }

  createGlow(rimHex, facingHex) {
    const uniforms = {
      color1: { value: new Color(rimHex) },
      color2: { value: new Color(facingHex) },
      fresnelBias: { value: 0.2 },
      fresnelScale: { value: 1.5 },
      fresnelPower: { value: 4.0 },
    };

    const vertexShader = `
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;
    
    varying float vReflectionFactor;
    
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    
      vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
    
      vec3 I = worldPosition.xyz - cameraPosition;
    
      vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
    
      gl_Position = projectionMatrix * mvPosition;
    }
    `;

    const fragmentShader = `
      uniform vec3 color1;
      uniform vec3 color2;
      
      varying float vReflectionFactor;
      
      void main() {
        float f = clamp( vReflectionFactor, 0.0, 1.0 );
        gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
      }
    `;

    const planetGlowMaterial = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: AdditiveBlending,
    });
    const planetGlowMesh = new Mesh(this.planetGeometry, planetGlowMaterial);
    planetGlowMesh.scale.setScalar(1.1);
    
   
    planetGlowMesh.userData = {
      name: this.name,
      planetSize: this.planetSize,
      isPlanetGlow: true,
    };
    
    this.planetGroup.add(planetGlowMesh);
  }

  createRings() {
    if (!this.rings) return;

    const innerRadius = this.planetSize + 0.1;
    const outerRadius = innerRadius + this.rings.ringsSize;

    const ringsGeometry = new RingGeometry(innerRadius, outerRadius, 32);

    const ringsMaterial = new MeshBasicMaterial({
      side: DoubleSide,
      transparent: true,
      map: this.loader.load(this.rings.ringsTexture),
    });

    const ringMesh = new Mesh(ringsGeometry, ringsMaterial);
    ringMesh.rotation.x = Math.PI / 2;
    
    
    ringMesh.userData = {
      name: this.name,
      planetSize: this.planetSize,
      isPlanetRings: true,
    };
    
    this.planetGroup.add(ringMesh);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    const isLight = theme === 'light';
    
    
    if (this.orbitMesh && this.orbitMesh.material) {
      if (isLight) {
        this.orbitMesh.material.color.setHex(0x404040); 
        this.orbitMesh.material.opacity = 0.6;
      } else {
        this.orbitMesh.material.color.setHex(0xadd8e6); 
        this.orbitMesh.material.opacity = 0.5;
      }
    }
  }

  createAnimateFunction() {
    return () => {
      requestAnimationFrame(this.animate);

      this.updateOrbitRotation();
      this.updatePlanetRotation();
    };
  }

  updateOrbitRotation() {
    if (this.orbitRotationDirection === "clockwise") {
      this.group.rotation.y -= this.orbitSpeed;
    } else if (this.orbitRotationDirection === "counterclockwise") {
      this.group.rotation.y += this.orbitSpeed;
    }
  }

  updatePlanetRotation() {
    if (this.planetRotationDirection === "clockwise") {
      this.planetGroup.rotation.y -= this.planetRotationSpeed;
    } else if (this.planetRotationDirection === "counterclockwise") {
      this.planetGroup.rotation.y += this.planetRotationSpeed;
    }
  }

  getPlanet() {
    return this.group;
  }
}