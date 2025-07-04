import {
  Mesh,
  Group,
  Color,
  Vector3,
  BackSide,
  PointLight,
  AmbientLight,
  TextureLoader,
  ShaderMaterial,
  AdditiveBlending,
  DynamicDrawUsage,
  MeshBasicMaterial,
  IcosahedronGeometry,
} from "three";
import { ImprovedNoise } from "three/addons/math/ImprovedNoise.js";

export class Sun {
  constructor() {
    this.sunTexture = "/solar-system-threejs/assets/sun-map.jpg";
    this.group = new Group();
    this.loader = new TextureLoader();
    this.isLightTheme = false;

    this.createCorona();
    this.createRim();
    this.addLighting();
    this.createGlow();
    this.createSun();

    this.animate = this.createAnimateFunction();
    this.animate();
  }

  createSun() {
    const map = this.loader.load(this.sunTexture);
    const sunGeometry = new IcosahedronGeometry(5, 12);
    this.sunMaterial = new MeshBasicMaterial({
      map,
      emissive: new Color(0xffff99),
      emissiveIntensity: 1.5,
    });
    this.sunMesh = new Mesh(sunGeometry, this.sunMaterial);
    this.group.add(this.sunMesh);

    this.group.add(this.sunRim);
    this.group.add(this.corona);
    this.group.add(this.glow);

    this.group.userData.update = (t) => {
      this.group.rotation.y = -t / 5;
      this.corona.userData.update(t);
    };
  }

  createCorona() {
    const coronaGeometry = new IcosahedronGeometry(4.9, 12);
    this.coronaMaterial = new MeshBasicMaterial({
      color: 0xff0000,
      side: BackSide,
    });
    this.corona = new Mesh(coronaGeometry, this.coronaMaterial);
    const coronaNoise = new ImprovedNoise();

    let v3 = new Vector3();
    let p = new Vector3();
    let pos = coronaGeometry.attributes.position;
    pos.usage = DynamicDrawUsage;
    const len = pos.count;

    const update = (t) => {
      for (let i = 0; i < len; i += 1) {
        p.fromBufferAttribute(pos, i).normalize();
        v3.copy(p).multiplyScalar(5);
        let ns = coronaNoise.noise(
          v3.x + Math.cos(t),
          v3.y + Math.sin(t),
          v3.z + t
        );
        v3.copy(p)
          .setLength(5)
          .addScaledVector(p, ns * 0.4);
        pos.setXYZ(i, v3.x, v3.y, v3.z);
      }
      pos.needsUpdate = true;
    };

    this.corona.userData.update = update;
  }

  createGlow() {
    this.glowUniforms = {
      color1: { value: new Color(0x000000) },
      color2: { value: new Color(0xff0000) },
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

    const sunGlowMaterial = new ShaderMaterial({
      uniforms: this.glowUniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: AdditiveBlending,
    });
    const sunGlowGeometry = new IcosahedronGeometry(5, 12);
    this.glow = new Mesh(sunGlowGeometry, sunGlowMaterial);
    this.glow.scale.setScalar(1.1);
  }

  createRim() {
    this.rimUniforms = {
      color1: { value: new Color(0xffff99) },
      color2: { value: new Color(0x000000) },
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

    const sunRimMaterial = new ShaderMaterial({
      uniforms: this.rimUniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: AdditiveBlending,
    });
    const sunRimGeometry = new IcosahedronGeometry(5, 12);
    this.sunRim = new Mesh(sunRimGeometry, sunRimMaterial);
    this.sunRim.scale.setScalar(1.01);
  }

  addLighting() {
    this.sunLight = new PointLight(0xffff99, 1000, 100);
    this.sunLight.position.set(0, 0, 0);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 100;
    this.group.add(this.sunLight);
    
    this.ambientLight = new AmbientLight(0x404040, 0.5);
    this.group.add(this.ambientLight);
  }

  setTheme(theme) {
    this.isLightTheme = theme === 'light';
    
    
    if (this.sunMaterial) {
      this.sunMaterial.emissive.setHex(this.isLightTheme ? 0xffcc66 : 0xffff99);
      this.sunMaterial.emissiveIntensity = this.isLightTheme ? 1.2 : 1.5;
    }
    
    
    if (this.coronaMaterial) {
      this.coronaMaterial.color.setHex(this.isLightTheme ? 0xff6600 : 0xff0000);
    }
    
    
    if (this.glowUniforms) {
      this.glowUniforms.color2.value.setHex(this.isLightTheme ? 0xff5500 : 0xff0000);
    }
    
    
    if (this.rimUniforms) {
      this.rimUniforms.color1.value.setHex(this.isLightTheme ? 0xffcc66 : 0xffff99);
    }
    
    
    if (this.sunLight) {
      this.sunLight.color.setHex(this.isLightTheme ? 0xffcc66 : 0xffff99);
      this.sunLight.intensity = this.isLightTheme ? 800 : 1000;
    }
    
    if (this.ambientLight) {
      this.ambientLight.intensity = this.isLightTheme ? 0.3 : 0.5;
    }
  }

  createAnimateFunction() {
    return (t = 0) => {
      const time = t * 0.00051;
      requestAnimationFrame(this.animate);
      this.group.userData.update(time);
    };
  }

  getSun() {
    return this.group;
  }
}