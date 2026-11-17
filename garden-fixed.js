import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

/* =================================
   PAGE NAVIGATION
================================= */

const btn_enter = document.querySelector("#btnEnter");
const sections = document.querySelectorAll(".page");

function showSection(sectionId) {
  sections.forEach((section) => section.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");
}

btn_enter.addEventListener("click", () => showSection("profile"));

/* =================================
   WANDER BUTTON
================================= */

const btn_wander = document.querySelector("#btnWander");
const btnName = document.querySelector("#btnName");
const btnColor = document.querySelector("#btnColor");
const txt_warnName = document.querySelector("#txt_warnName");

btn_wander.addEventListener("click", () => {
  if (btnName.value.trim() === "") {
    txt_warnName.textContent = "Enter Your Name";
    return;
  }
  txt_warnName.textContent = "";
  showSection("garden");

  const bgAmbient = document.querySelector("#bgAmbient");
  if (bgAmbient) {
    bgAmbient.volume = 0.25;
    bgAmbient.play().catch((error) => {
      console.log("Audio playback could not start:", error);
    });
  }
});

/* =================================
   RENDERER / SCENE / CAMERA
================================= */

const garden = document.querySelector("#garden");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x777b4b);
scene.fog = new THREE.Fog(0x777b4b, 65, 155);

const camera = new THREE.PerspectiveCamera(
  48,
  window.innerWidth / window.innerHeight,
  0.1,
  200,
);
camera.position.set(0, 15, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.domElement.style.display = "block";
garden.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.6, // strength (was 1.15)
  0.6, // radius
  0.85, // threshold (was 0.72)
);
composer.addPass(bloom);
// Applies the renderer's ACES tone mapping + sRGB output to the composer result.
composer.addPass(new OutputPass());

/* =================================
   LIGHTING
================================= */

scene.add(new THREE.AmbientLight(0xffe8c2, 1.5));

const sunlight = new THREE.DirectionalLight(0xffe5b3, 2.5);
sunlight.position.set(-15, 25, 10);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(2048, 2048);
sunlight.shadow.camera.left = -45;
sunlight.shadow.camera.right = 45;
sunlight.shadow.camera.top = 45;
sunlight.shadow.camera.bottom = -45;
scene.add(sunlight);

/* =================================
   GROUND
================================= */

function makeGroundTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#85834e";
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 180; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 12 + Math.random() * 58;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(
      0,
      Math.random() > 0.5 ? "rgba(185,160,91,0.16)" : "rgba(49,67,39,0.14)",
    );
    gradient.addColorStop(1, "rgba(70,65,35,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 1.8 + 0.35;
    ctx.fillStyle =
      Math.random() > 0.52 ? "rgba(226,205,145,0.20)" : "rgba(36,48,28,0.16)";
    ctx.fillRect(x, y, size, size);
  }
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle =
      Math.random() > 0.5 ? "rgba(190,169,112,0.32)" : "rgba(45,57,35,0.24)";
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      1 + Math.random() * 2.5,
      0.7 + Math.random() * 1.5,
      Math.random(),
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(22, 22);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  map: makeGroundTexture(),
  roughness: 1,
});

const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.12;
ground.receiveShadow = true;
scene.add(ground);

/* =================================
   LAKE
================================= */

const lakeX = 13;
const lakeZ = 5;
const lakeRadiusX = 8;
const lakeRadiusZ = 5;

function isInsideLake(x, z, margin = 0) {
  const dx = (x - lakeX) / (lakeRadiusX + margin);
  const dz = (z - lakeZ) / (lakeRadiusZ + margin);
  return dx * dx + dz * dz < 1;
}

const shore = new THREE.Mesh(
  new THREE.CircleGeometry(1, 80),
  new THREE.MeshStandardMaterial({ color: 0xb5a36b, roughness: 1 }),
);
shore.rotation.x = -Math.PI / 2;
shore.position.set(lakeX, -0.02, lakeZ);
shore.scale.set(lakeRadiusX + 0.8, lakeRadiusZ + 0.8, 1);
scene.add(shore);

const waterMaterial = new THREE.MeshStandardMaterial({
  color: 0x79aaa0,
  roughness: 0.18,
  metalness: 0.08,
});
const water = new THREE.Mesh(new THREE.CircleGeometry(1, 80), waterMaterial);
water.rotation.x = -Math.PI / 2;
water.position.set(lakeX, 0.03, lakeZ);
water.scale.set(lakeRadiusX, lakeRadiusZ, 1);
scene.add(water);

/* =================================
   GRASS WITH WIND
================================= */

const GRASS_COUNT = 6500;
const grassMaterial = new THREE.MeshStandardMaterial({
  color: 0x9b9c51,
  roughness: 1,
});

let grassShader = null;
grassMaterial.onBeforeCompile = (shader) => {
  grassShader = shader;
  shader.uniforms.uTime = { value: 0 };
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `#include <common>
     uniform float uTime;`,
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `#include <begin_vertex>
     float wind = sin(uTime * 1.2
       + instanceMatrix[3].x * 0.25
       + instanceMatrix[3].z * 0.2);
     float wind2 = cos(uTime * 0.8
       + instanceMatrix[3].z * 0.3);
     transformed.x += wind * position.y * 0.11;
     transformed.z += wind2 * position.y * 0.07;`,
  );
};
grassMaterial.customProgramCacheKey = () => "swaying-grass-v1";

const grass = new THREE.InstancedMesh(
  new THREE.BoxGeometry(0.09, 0.65, 0.09),
  grassMaterial,
  GRASS_COUNT,
);

const dummy = new THREE.Object3D();
const grassColors = [0x858a45, 0xa5a45b, 0xb1a967, 0x777d3e, 0xc0b36a].map(
  (c) => new THREE.Color(c),
);

for (let i = 0; i < GRASS_COUNT; ) {
  const x = (Math.random() - 0.5) * 85;
  const z = (Math.random() - 0.5) * 85;
  if (isInsideLake(x, z, 1.3)) continue;

  const height = 0.35 + Math.random() * 0.6;
  dummy.position.set(x, height / 2 - 0.05, z);
  dummy.scale.set(
    0.7 + Math.random() * 0.5,
    height,
    0.7 + Math.random() * 0.5,
  );
  dummy.rotation.y = Math.random() * Math.PI;
  dummy.updateMatrix();

  grass.setMatrixAt(i, dummy.matrix);
  grass.setColorAt(
    i,
    grassColors[Math.floor(Math.random() * grassColors.length)],
  );
  i++;
}
grass.instanceMatrix.needsUpdate = true;
scene.add(grass);

/* =================================
   BACKGROUND FLOWERS
================================= */

const bgFlowerColors = [0xfff0ce, 0xffe5a4, 0xf9d9b6, 0xfff8e9];
const bgFlowerGroup = new THREE.Group();
const bgPetalGeometry = new THREE.SphereGeometry(0.13, 8, 8);
const bgCenterGeometry = new THREE.SphereGeometry(0.07, 8, 8);
const bgCenterMaterial = new THREE.MeshBasicMaterial({
  color: 0xffd57b,
  toneMapped: false,
});

for (let i = 0; i < 400; i++) {
  const x = (Math.random() - 0.5) * 85;
  const z = (Math.random() - 0.5) * 85;
  if (isInsideLake(x, z, 1.5)) continue;

  const flower = new THREE.Group();
  flower.position.set(x, 0.15, z);

  const petalMaterial = new THREE.MeshBasicMaterial({
    color: bgFlowerColors[Math.floor(Math.random() * bgFlowerColors.length)],
    toneMapped: false,
  });

  for (let p = 0; p < 5; p++) {
    const angle = (p / 5) * Math.PI * 2;
    const petal = new THREE.Mesh(bgPetalGeometry, petalMaterial);
    petal.position.set(Math.cos(angle) * 0.13, 0, Math.sin(angle) * 0.13);
    petal.scale.set(1, 0.45, 1);
    flower.add(petal);
  }
  flower.add(new THREE.Mesh(bgCenterGeometry, bgCenterMaterial));
  bgFlowerGroup.add(flower);
}
scene.add(bgFlowerGroup);

/* =================================
   TREES (shared builder)
================================= */

const barkMaterial = new THREE.MeshStandardMaterial({
  color: 0x806044,
  roughness: 0.95,
  metalness: 0,
});
// Several warm tones so the canopy has depth instead of one flat blob.
const leafMaterials = [0xffd8a1, 0xf2c58a, 0xe8b57a, 0xd9a86c].map(
  (c) => new THREE.MeshBasicMaterial({ color: c, toneMapped: false }),
);
const leafGeometry = new THREE.SphereGeometry(0.32, 9, 8);

function createTree() {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.8, 7, 9),
    barkMaterial,
  );
  trunk.position.y = 3.5;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);

  function addBranch(start, end, radius) {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(b, a);

    const branch = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.5, radius, direction.length(), 7),
      barkMaterial,
    );
    branch.position.copy(a).add(b).multiplyScalar(0.5);
    branch.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize(),
    );
    branch.castShadow = true;
    tree.add(branch);
  }

  addBranch([0, 3.5, 0], [-2.2, 6.5, 0], 0.32);
  addBranch([0, 4.2, 0], [2.2, 7, 0.4], 0.3);
  addBranch([0, 5, 0], [0.4, 8, -1.5], 0.25);
  addBranch([0, 4, 0], [-1, 7, 1.8], 0.25);

  for (let i = 0; i < 140; i++) {
    const leaf = new THREE.Mesh(
      leafGeometry,
      leafMaterials[Math.floor(Math.random() * leafMaterials.length)],
    );
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 4;
    leaf.position.set(
      Math.cos(angle) * radius,
      6 + Math.random() * 3,
      Math.sin(angle) * radius,
    );
    leaf.scale.set(1 + Math.random() * 0.7, 0.6, 0.8);
    tree.add(leaf);
  }

  return tree;
}

// Central memory tree
const memoryTree = createTree();
memoryTree.position.set(-8, 0, -5);
scene.add(memoryTree);

/* =================================
   GLOWING FOREST
================================= */

const forestLights = new THREE.Group();

function addForestTree(x, z, scale = 1) {
  const t = createTree();
  t.position.set(x, 0, z);
  t.scale.setScalar(scale);
  t.rotation.y = Math.random() * Math.PI * 2;
  scene.add(t);

  const canopyLight = new THREE.PointLight(0xffd7a0, 0.75, 10);
  canopyLight.position.set(x, 6.8 * scale, z);
  forestLights.add(canopyLight);
}

const forestPositions = [
  [-24, -18, 1.15], [-17, -24, 0.88], [-7, -23, 1.0], [3, -25, 0.92],
  [14, -27, 1.12], [25, -21, 1.0], [31, -10, 0.9], [30, 4, 1.08],
  [27, 19, 0.95], [17, 25, 1.12], [5, 28, 0.92], [-8, 26, 1.1],
  [-21, 22, 0.95], [-29, 10, 1.12], [-30, -5, 0.9], [-22, 2, 0.85],
  [-18, -11, 0.72], [-5, -13, 0.82], [4, -14, 0.76], [24, -12, 0.82],
  [23, 14, 0.78], [4, 17, 0.78], [-12, 15, 0.82], [-27, -28, 1.0],
  [0, -34, 1.08], [29, -32, 1.0], [37, 22, 0.92], [-37, 24, 1.0],
  [-38, -17, 1.05],
];

forestPositions.forEach(([x, z, scale]) => {
  if (Math.hypot(x - lakeX, z - lakeZ) < 10.8) return;
  if (Math.hypot(x + 8, z + 5) < 5.5) return;
  addForestTree(x, z, scale);
});
scene.add(forestLights);

/* =================================
   LAKESIDE BENCH
================================= */

const bench = new THREE.Group();
const benchWood = new THREE.MeshStandardMaterial({
  color: 0x76533a,
  roughness: 0.88,
});
const benchLeg = new THREE.MeshStandardMaterial({
  color: 0x4e3b2d,
  roughness: 0.95,
});

const benchSeat = new THREE.Mesh(
  new THREE.BoxGeometry(2.8, 0.18, 0.72),
  benchWood,
);
benchSeat.position.y = 0.72;
bench.add(benchSeat);

const benchBack = new THREE.Mesh(
  new THREE.BoxGeometry(2.8, 1.05, 0.16),
  benchWood,
);
benchBack.position.set(0, 1.25, -0.28);
bench.add(benchBack);

for (const x of [-1.12, 1.12]) {
  for (const z of [-0.22, 0.22]) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.72, 0.16),
      benchLeg,
    );
    leg.position.set(x, 0.36, z);
    bench.add(leg);
  }
}
bench.position.set(13, 0, -1.8);
bench.rotation.y = Math.PI;
bench.traverse((part) => {
  if (part.isMesh) {
    part.castShadow = true;
    part.receiveShadow = true;
  }
});
scene.add(bench);

/* =================================
   WATERFALL
================================= */

const waterfall = new THREE.Group();
waterfall.position.set(13, 0, -19);
scene.add(waterfall);

const cliffMaterial = new THREE.MeshStandardMaterial({
  color: 0x626b58,
  roughness: 0.96,
  flatShading: true,
});
for (let i = 0; i < 9; i++) {
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.5 + Math.random() * 1.4, 0),
    cliffMaterial,
  );
  rock.position.set(
    (i - 4) * 1.15,
    3.2 + Math.random() * 1.8,
    -0.4 + Math.random() * 0.7,
  );
  rock.scale.set(1.0, 1.3 + Math.random() * 0.8, 0.8);
  rock.castShadow = true;
  waterfall.add(rock);
}

const waterfallUniforms = { uTime: { value: 0 } };
const waterfallMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  uniforms: waterfallUniforms,
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      float flow = fract(vUv.y * 5.0 + uTime * 1.25);
      float streaks = smoothstep(0.12, 0.0, abs(fract(vUv.x * 19.0 + sin(vUv.y * 8.0) * 0.08) - 0.5));
      float shimmer = 0.72 + 0.28 * sin(vUv.x * 34.0 + vUv.y * 20.0 - uTime * 5.0);
      float ribbons = 0.55 + 0.45 * sin(flow * 6.2831 + vUv.x * 8.0);
      vec3 deep = vec3(0.20, 0.57, 0.68);
      vec3 bright = vec3(0.78, 0.94, 1.0);
      vec3 color = mix(deep, bright, clamp(streaks * 0.7 + ribbons * 0.35, 0.0, 1.0));
      float alpha = 0.52 + 0.35 * streaks;
      alpha *= smoothstep(0.0, 0.08, vUv.x) * (1.0 - smoothstep(0.92, 1.0, vUv.x));
      gl_FragColor = vec4(color * shimmer, alpha);
    }
  `,
});

const waterfallSheet = new THREE.Mesh(
  new THREE.PlaneGeometry(6.2, 7.2, 1, 1),
  waterfallMaterial,
);
waterfallSheet.position.set(0, 4.8, 1.05);
waterfall.add(waterfallSheet);

const waterfallPool = new THREE.Mesh(
  new THREE.CircleGeometry(1, 48),
  new THREE.MeshStandardMaterial({
    color: 0x579eaa,
    roughness: 0.2,
    metalness: 0.12,
    transparent: true,
    opacity: 0.9,
  }),
);
waterfallPool.rotation.x = -Math.PI / 2;
waterfallPool.position.set(0, 0.05, 2.2);
waterfallPool.scale.set(4.0, 1.65, 1);
waterfall.add(waterfallPool);

const waterfallMist = new THREE.PointLight(0x9bdfff, 2.0, 13);
waterfallMist.position.set(0, 3.0, 2.4);
waterfall.add(waterfallMist);

for (let i = 0; i < 24; i++) {
  const splash = new THREE.Mesh(
    new THREE.SphereGeometry(0.07 + Math.random() * 0.08, 8, 8),
    new THREE.MeshBasicMaterial({
      color: 0xbcefff,
      transparent: true,
      opacity: 0.7,
      toneMapped: false,
    }),
  );
  splash.position.set(
    (Math.random() - 0.5) * 5.5,
    0.15 + Math.random() * 0.35,
    1.6 + Math.random() * 1.2,
  );
  splash.userData.phase = Math.random() * Math.PI * 2;
  waterfall.add(splash);
}

/* =================================
   CARDBOARD SHELTERS
================================= */

const cardboardGroup = new THREE.Group();
const cardboardMaterial = new THREE.MeshStandardMaterial({
  color: 0x9a7954,
  roughness: 1,
});

function createCardboard(x, z) {
  const box = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.25, 1.7),
    cardboardMaterial,
  );
  base.position.y = 0.12;
  box.add(base);

  const back = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.15, 0.16),
    cardboardMaterial,
  );
  back.position.set(0, 0.65, -0.75);
  box.add(back);

  const side = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.85, 1.5),
    cardboardMaterial,
  );
  side.position.set(-1.05, 0.5, 0);
  box.add(side);

  const otherSide = side.clone();
  otherSide.position.x = 1.05;
  box.add(otherSide);

  box.position.set(x, 0, z);
  cardboardGroup.add(box);
  return box;
}

const shelters = [
  createCardboard(-18, -8),
  createCardboard(20, -17),
  createCardboard(-23, 19),
];
scene.add(cardboardGroup);

/* =================================
   SOUL CREATION
================================= */

function createSoul(color, size = 0.35) {
  const group = new THREE.Group();

  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(size, 24, 24),
    new THREE.MeshBasicMaterial({ color, toneMapped: false }),
  );
  group.add(orb);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(size * 1.7, 20, 20),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  group.add(glow);

  const light = new THREE.PointLight(color, 2, 5);
  group.add(light);

  return { group, orb, glow, light };
}

/* =================================
   PLAYER SOUL
================================= */

const playerSoul = createSoul(btnColor.value, 0.4);
const playerOrb = playerSoul.group;
playerOrb.position.set(0, 0.8, 12);
scene.add(playerOrb);

btnColor.addEventListener("input", () => {
  playerSoul.orb.material.color.set(btnColor.value);
  playerSoul.glow.material.color.set(btnColor.value);
  playerSoul.light.color.set(btnColor.value);
});

/* =================================
   OTHER SOULS
================================= */

function createZzzSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  context.font = "bold 55px Georgia";
  context.fillStyle = "#fff1c9";
  context.textAlign = "center";
  context.fillText("Z z z", 128, 80);

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      transparent: true,
      depthWrite: false,
    }),
  );
  sprite.scale.set(1.2, 0.6, 1);
  return sprite;
}

const otherSouls = [];
const soulColors = [
  0xffd5a1, 0xf6c6d9, 0xb8d8cf, 0xd8c7ff, 0xffe8a6, 0xc6d5ff,
];

function randomPosition() {
  let x, z;
  do {
    x = (Math.random() - 0.5) * 65;
    z = (Math.random() - 0.5) * 65;
  } while (isInsideLake(x, z, 1.5));
  return new THREE.Vector3(x, 0.8, z);
}

function createOtherSouls() {
  for (let i = 0; i < 12; i++) {
    const soul = createSoul(
      soulColors[i % soulColors.length],
      0.28 + Math.random() * 0.1,
    );
    soul.group.position.copy(randomPosition());

    let behavior = "wander";
    if (i < 3) behavior = "sleep";
    else if (i < 6) behavior = "chase";

    if (behavior === "sleep") {
      const shelter = shelters[i % shelters.length];
      soul.group.position.set(
        shelter.position.x + (Math.random() - 0.5) * 0.8,
        0.35,
        shelter.position.z + (Math.random() - 0.5) * 0.4,
      );
      soul.group.scale.set(1.15, 0.55, 0.8);

      const zzz = createZzzSprite();
      zzz.position.set(0, 1.15, 0);
      soul.group.add(zzz);
      soul.zzz = zzz;
    }

    scene.add(soul.group);
    otherSouls.push({
      ...soul,
      behavior,
      target: randomPosition(),
      speed: 1 + Math.random() * 1.2,
      timer: Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
    });
  }
}
createOtherSouls();

function updateOtherSouls(delta, time) {
  otherSouls.forEach((soul) => {
    soul.timer -= delta;
    const position = soul.group.position;

    if (soul.behavior === "sleep") {
      soul.glow.scale.setScalar(1 + Math.sin(time * 1.5 + soul.phase) * 0.06);
      position.y = 0.35 + Math.sin(time * 1.2 + soul.phase) * 0.035;
      if (soul.zzz) {
        soul.zzz.position.y = 1.15 + Math.sin(time * 1.5 + soul.phase) * 0.12;
        soul.zzz.material.rotation = Math.sin(time + soul.phase) * 0.08;
      }
      return;
    }

    if (soul.behavior === "chase") {
      if (soul.timer <= 0) {
        soul.timer = 2 + Math.random() * 3;
        soul.behavior = Math.random() > 0.3 ? "chase" : "wander";
      }
      if (soul.behavior === "chase") soul.target.copy(playerOrb.position);
    }

    if (soul.behavior === "wander" && soul.timer <= 0) {
      soul.target = randomPosition();
      soul.timer = 3 + Math.random() * 5;
    }

    const dx = soul.target.x - position.x;
    const dz = soul.target.z - position.z;
    const distance = Math.hypot(dx, dz);

    if (distance > 0.3) {
      const speed = soul.behavior === "chase" ? soul.speed * 1.5 : soul.speed;
      const step = Math.min(speed * delta, distance);
      const nextX = position.x + (dx / distance) * step;
      const nextZ = position.z + (dz / distance) * step;

      if (!isInsideLake(nextX, nextZ, 0.6)) {
        position.x = nextX;
        position.z = nextZ;
      } else {
        soul.target = randomPosition();
      }
    }

    position.y = 0.8 + Math.sin(time * 2 + soul.phase) * 0.1;
    soul.glow.scale.setScalar(1 + Math.sin(time * 2 + soul.phase) * 0.08);
  });
}

/* =================================
   CONTROLS: WASD to move, arrows to orbit camera
================================= */

const keys = {};
let cameraAngle = 0;
let cameraHeight = 14;
const cameraDistance = 18;

const controlCodes = [
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "KeyW", "KeyA", "KeyS", "KeyD",
];

window.addEventListener("keydown", (event) => {
  if (!controlCodes.includes(event.code)) return;
  if (event.target.matches("input, textarea")) return;
  event.preventDefault();
  keys[event.code] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

window.addEventListener("blur", () => {
  Object.keys(keys).forEach((k) => (keys[k] = false));
});

const playerSpeed = 7;
const worldLimit = 44;

function movePlayer(delta) {
  // Camera orbit
  if (keys.ArrowLeft) cameraAngle += 1.6 * delta;
  if (keys.ArrowRight) cameraAngle -= 1.6 * delta;
  if (keys.ArrowUp) cameraHeight = Math.min(cameraHeight + 8 * delta, 24);
  if (keys.ArrowDown) cameraHeight = Math.max(cameraHeight - 8 * delta, 6);

  // Movement relative to the camera direction
  const forward = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0);
  const right = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);

  let moveX = -Math.sin(cameraAngle) * forward + Math.cos(cameraAngle) * right;
  let moveZ = -Math.cos(cameraAngle) * forward - Math.sin(cameraAngle) * right;

  const length = Math.hypot(moveX, moveZ);
  if (length > 0) {
    moveX /= length;
    moveZ /= length;
  }

  const distance = playerSpeed * delta;
  const nextX = playerOrb.position.x + moveX * distance;
  const nextZ = playerOrb.position.z + moveZ * distance;

  if (
    Math.abs(nextX) < worldLimit &&
    !isInsideLake(nextX, playerOrb.position.z, 0.65)
  ) {
    playerOrb.position.x = nextX;
  }
  if (
    Math.abs(nextZ) < worldLimit &&
    !isInsideLake(playerOrb.position.x, nextZ, 0.65)
  ) {
    playerOrb.position.z = nextZ;
  }
}

function updateCamera(delta) {
  const target = new THREE.Vector3(
    playerOrb.position.x + Math.sin(cameraAngle) * cameraDistance,
    cameraHeight,
    playerOrb.position.z + Math.cos(cameraAngle) * cameraDistance,
  );
  camera.position.lerp(target, 1 - Math.pow(0.001, delta));
  camera.lookAt(playerOrb.position.x, 0, playerOrb.position.z);
}

/* =================================
   MEMORY FLOWERS
================================= */

const btn_plantMain = document.querySelector(".btn_plantMain");
const message = document.querySelector(".message");
const userMemoryName = document.querySelector(".btn_userMemoryName");
const messageFromUser = document.querySelector("#messageFromUser");
const txt_warnPlant = document.querySelector(".txt_warnPlant");
const flowerColor = document.querySelector(".flowerColor");
const btn_plant = document.querySelector(".btn_plant");

const MEMORY_STORAGE_KEY = "theLittleSouls_memories_v2";
const memoryFlowers = [];
const memoryAnimations = [];
const memoryRaycaster = new THREE.Raycaster();
const memoryMouse = new THREE.Vector2();

// Tooltip is created here so the HTML doesn't need it.
const memoryTooltip = document.createElement("div");
Object.assign(memoryTooltip.style, {
  display: "none",
  position: "fixed",
  zIndex: "30",
  pointerEvents: "none",
  maxWidth: "240px",
  padding: "14px 18px",
  borderRadius: "12px",
  background: "rgba(48, 49, 35, 0.92)",
  color: "#fff2d7",
  fontSize: "13px",
  lineHeight: "1.7",
  textAlign: "center",
  whiteSpace: "pre-line",
  transform: "translate(-50%, -120%)",
  border: "1px solid rgba(255, 232, 190, 0.35)",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.22)",
});
document.body.appendChild(memoryTooltip);

function getSavedMemories() {
  try {
    const saved = JSON.parse(localStorage.getItem(MEMORY_STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.warn("Could not read saved memories:", error);
    return [];
  }
}

function saveMemoryToStorage(memory) {
  const memories = getSavedMemories();
  memories.push(memory);
  try {
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memories));
  } catch (error) {
    console.warn("Could not save memory:", error);
  }
}

function createMemoryFlower(name, text, color, x, z, animateIn) {
  const group = new THREE.Group();

  const stemMaterial = new THREE.MeshStandardMaterial({
    color: 0x78945a,
    roughness: 0.9,
    emissive: 0x243b20,
    emissiveIntensity: 0.25,
  });
  const petalMaterial = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.72,
  });
  const centerMaterial = new THREE.MeshStandardMaterial({
    color: 0xffe0a0,
    roughness: 0.8,
  });

  const stemGroup = new THREE.Group();
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.075, 1.0, 8),
    stemMaterial,
  );
  stem.position.y = 0.5;
  stem.castShadow = true;
  stemGroup.add(stem);

  const leftLeaf = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 10, 8),
    new THREE.MeshStandardMaterial({
      color: 0x91a968,
      roughness: 0.85,
      emissive: 0x263b1e,
      emissiveIntensity: 0.2,
    }),
  );
  leftLeaf.position.set(-0.17, 0.38, 0);
  leftLeaf.scale.set(1.0, 0.32, 0.58);
  leftLeaf.rotation.z = 0.42;
  stemGroup.add(leftLeaf);

  const rightLeaf = leftLeaf.clone();
  rightLeaf.position.set(0.16, 0.62, 0);
  rightLeaf.rotation.z = -0.45;
  stemGroup.add(rightLeaf);
  group.add(stemGroup);

  const flowerHead = new THREE.Group();
  flowerHead.position.y = 1.02;

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const petal = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 12, 10),
      petalMaterial,
    );
    petal.position.set(Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2);
    petal.scale.set(1.0, 0.48, 0.72);
    petal.rotation.y = -angle;
    flowerHead.add(petal);
  }

  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.105, 12, 10),
    centerMaterial,
  );
  center.position.y = 0.035;
  flowerHead.add(center);
  group.add(flowerHead);

  // Invisible hover target
  const hitArea = new THREE.Mesh(
    new THREE.SphereGeometry(0.78, 12, 10),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      colorWrite: false,
    }),
  );
  hitArea.position.y = 1.0;
  group.add(hitArea);

  group.position.set(x, 0, z);
  group.rotation.y = Math.random() * Math.PI * 2;
  group.userData.memory = { name, text };
  group.userData.flowerHead = flowerHead;
  group.userData.stemGroup = stemGroup;
  group.userData.growing = animateIn;

  if (animateIn) {
    stemGroup.scale.y = 0.001;
    flowerHead.scale.setScalar(0.001);
    memoryAnimations.push({ group, elapsed: 0, growDuration: 2.1 });
  }

  scene.add(group);
  memoryFlowers.push(group);
  return group;
}

function findFlowerSpot() {
  for (let attempt = 0; attempt < 18; attempt++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.4 + Math.random() * 1.4;
    const x = playerOrb.position.x + Math.cos(angle) * radius;
    const z = playerOrb.position.z + Math.sin(angle) * radius;
    if (!isInsideLake(x, z, 1.2) && Math.abs(x) < worldLimit && Math.abs(z) < worldLimit) {
      return { x, z };
    }
  }
  return { x: playerOrb.position.x + 1.5, z: playerOrb.position.z + 1.0 };
}

function restoreSavedMemories() {
  getSavedMemories().forEach((m) => {
    if (m && typeof m.text === "string" && m.text.trim()) {
      createMemoryFlower(m.name || "A little memory", m.text, m.color, m.x, m.z, false);
    }
  });
}
restoreSavedMemories();

function updateMemoryAnimations(delta, time) {
  for (let i = memoryAnimations.length - 1; i >= 0; i--) {
    const anim = memoryAnimations[i];
    anim.elapsed += delta;
    const progress = Math.min(1, anim.elapsed / anim.growDuration);
    const eased = progress * progress * (3 - 2 * progress);

    anim.group.userData.stemGroup.scale.y = Math.max(
      0.001,
      Math.min(1, eased * 1.18),
    );
    const bloom = THREE.MathUtils.clamp((progress - 0.32) / 0.68, 0, 1);
    anim.group.userData.flowerHead.scale.setScalar(Math.max(0.001, bloom));

    if (progress >= 1) {
      anim.group.userData.growing = false;
      memoryAnimations.splice(i, 1);
    }
  }

  memoryFlowers.forEach((flower, index) => {
    flower.rotation.z = Math.sin(time * 0.7 + index) * 0.035;
    flower.userData.flowerHead.rotation.z = Math.sin(time * 1.1 + index) * 0.045;
  });
}

btn_plantMain.addEventListener("click", () => {
  message.classList.toggle("active");
});

btn_plant.addEventListener("click", () => {
  const name = userMemoryName.value.trim();
  const text = messageFromUser.value.trim();

  if (name === "" || text === "") {
    txt_warnPlant.textContent = "Fill in the input";
    return;
  }
  txt_warnPlant.textContent = "";

  const color = flowerColor.value;
  const { x, z } = findFlowerSpot();

  saveMemoryToStorage({ name, text, color, x, z });
  createMemoryFlower(name, text, color, x, z, true);

  userMemoryName.value = "";
  messageFromUser.value = "";
  message.classList.remove("active");
});

function findMemoryRoot(object) {
  let current = object;
  while (current && !current.userData.memory) current = current.parent;
  return current;
}

window.addEventListener("pointermove", (event) => {
  if (message.classList.contains("active")) {
    memoryTooltip.style.display = "none";
    return;
  }

  memoryMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  memoryMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  camera.updateMatrixWorld();
  memoryRaycaster.setFromCamera(memoryMouse, camera);

  const hits = memoryRaycaster.intersectObjects(memoryFlowers, true);
  const group = hits.length ? findMemoryRoot(hits[0].object) : null;

  if (group && !group.userData.growing) {
    const { name, text } = group.userData.memory;
    memoryTooltip.textContent = name + "\n\u201C" + text + "\u201D";
    memoryTooltip.style.display = "block";
    memoryTooltip.style.left = event.clientX + "px";
    memoryTooltip.style.top = event.clientY + "px";
    document.body.style.cursor = "pointer";
  } else {
    memoryTooltip.style.display = "none";
    document.body.style.cursor = "default";
  }
});

/* =================================
   ANIMATION LOOP
================================= */

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.04);
  const time = clock.elapsedTime;

  if (grassShader) grassShader.uniforms.uTime.value = time;
  waterfallUniforms.uTime.value = time;
  waterfall.children.forEach((part) => {
    if (part.userData.phase !== undefined) {
      part.position.y =
        0.15 + Math.abs(Math.sin(time * 2.8 + part.userData.phase)) * 0.42;
    }
  });

  movePlayer(delta);
  playerOrb.position.y = 0.8 + Math.sin(time * 2.2) * 0.12;
  playerSoul.glow.scale.setScalar(1 + Math.sin(time * 2.5) * 0.08);

  updateOtherSouls(delta, time);
  updateMemoryAnimations(delta, time);
  updateCamera(delta);

  composer.render();
}

animate();

/* =================================
   RESIZE
================================= */

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  bloom.resolution.set(window.innerWidth, window.innerHeight);
});
