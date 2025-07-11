import {
  Group,
  Color,
  Points,
  Vector3,
  TextureLoader,
  PointsMaterial,
  BufferGeometry,
  AdditiveBlending,
  Float32BufferAttribute,
} from "three";

export class Starfield {
  constructor({ numStars = 1000 } = {}) {
    this.numStars = numStars;
    this.group = new Group();
    this.loader = new TextureLoader();
    this.isLightTheme = false;
    this.createStarfield();
    this.animate = this.createAnimateFunction();
    this.animate();
  }

  createStarfield() {
    let col;
    const verts = [];
    const colors = [];
    const positions = [];

    for (let i = 0; i < this.numStars; i += 1) {
      let p = this.getRandomSpherePoint();
      const { pos, hue } = p;
      positions.push(p);
      col = new Color().setHSL(hue, 0.2, Math.random());
      verts.push(pos.x, pos.y, pos.z);
      colors.push(col.r, col.g, col.b);
    }

    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(verts, 3));
    geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
    this.starMaterial = new PointsMaterial({
      size: 0.2,
      alphaTest: 0.5,
      transparent: true,
      vertexColors: true,
      blending: AdditiveBlending,
      map: this.loader.load("./assets/circle.png"),
    });
    this.points = new Points(geo, this.starMaterial);
    this.group.add(this.points);
  }

  getRandomSpherePoint() {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    return {
      pos: new Vector3(x, y, z),
      hue: 0.6,
      minDist: radius,
    };
  }

  setTheme(theme) {
    this.isLightTheme = theme === 'light';
    if (this.starMaterial) {
      
      this.starMaterial.color.setHex(this.isLightTheme ? 0x555555 : 0xffffff);
      this.starMaterial.opacity = this.isLightTheme ? 0.6 : 0.8;
    }
  }

  createAnimateFunction() {
    return () => {
      requestAnimationFrame(this.animate);
      this.group.rotation.y += 0.00005;
    };
  }

  getStarfield() {
    return this.group;
  }
}