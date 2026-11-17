console.log("worked");

//    ------------ Enter------------

const btn_enter = document.querySelector("#btnEnter");

const sections = document.querySelectorAll(".page");
function showSection(sectionId) {
  sections.forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");
}

btn_enter.addEventListener("click", () => {
  showSection("profile");
});

//    ------------  WANDER GARDEN ------------

const btn_wander = document.querySelector("#btnWander");
const btnName = document.querySelector("#btnName");
const btnColor = document.querySelector("#btnColor");
const txt_warnColor = document.querySelector("#txt_warnColor");
const txt_warnName = document.querySelector("#txt_warnName");
btn_wander.addEventListener("click", () => {
  if (btnName.value === "") {
    // if(input name fill & color choosen){
    // showSection("garden");
    txt_warnName.textContent = "Enter Your Name";
  } else {
    showSection("garden");
    const bgAmbient = document.querySelector("#bgAmbient");
    bgAmbient.volume = 0;
    bgAmbient.play().catch((error) => {
      console.log("Audio playback could not start:", error);
    });
  }
  console.log(btnColor.value, btnName.value);
});

//    ------------ GARDEN SECTION------------

const garden = document.querySelector("#garden");

import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb2bd7e);
// const fov = 75;
const aspect = w / h;
// const near = 0.001;
// const far = 100;
const fov = 48;
const near = 0.1;
const far = 200;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;
camera.position.y = 2;
camera.position.set(0, 15, 20);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();

// const sunLight = new THREE.DirectionalLight(0xffffff, 3);
// sunLight.position.set(-15, 25, 10);
// scene.add(sunLight);
//LIGHTING

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

//    ------------ USER SOUL  ------------

const colorInput = btnColor.value;
console.log(colorInput);
const geo01 = new THREE.SphereGeometry(0.4, 32, 16);
const mat01 = new THREE.MeshBasicMaterial({
  color: colorInput,
});

const mesh01 = new THREE.Mesh(geo01, mat01);
mesh01.position.y = 1;
mesh01.position.z = 10;
scene.add(mesh01);

btnColor.addEventListener("input", () => {
  //   console.log(btnColor.value);
  mat01.color.set(btnColor.value);
});
let cameraAngle = 0;
let cameraDistance = 5;
let cameraHeight = 2;
window.addEventListener("keydown", (event) => {
  // ---------------move the ball
  if (event.code === "KeyD") {
    // mesh01.position.x += 0.1;
    mesh01.position.x += 5;
  }
  if (event.code === "KeyA") {
    mesh01.position.x -= 5;
  }
  if (event.code === "KeyW") {
    mesh01.position.z -= 5;
  }
  if (event.code === "KeyS") {
    mesh01.position.z += 5;
  }
  console.log(event.code);

  //--------------- move the camera

  if (event.code === "ArrowLeft") {
    cameraAngle += 0.1;
    console.log(event.code);
  }
  if (event.code === "ArrowRight") {
    cameraAngle -= 0.1;
  }
  if (event.code === "ArrowUp") {
    cameraHeight = Math.min(cameraHeight + 0.3, 10);
  }
  if (event.code === "ArrowDown") {
    cameraHeight = Math.min(cameraHeight - 0.3, 0.5);
  }
});

//    ------------ GROUND  ------------
const land_geo = new THREE.PlaneGeometry(100, 100);
const land_material = new THREE.MeshStandardMaterial({
  color: 0xb2bd7e,
  transparent: true,
  opacity: 1,
});
const land_mesh = new THREE.Mesh(land_geo, land_material);
land_mesh.rotation.x = -Math.PI / 2;
scene.add(land_mesh);

//    ------------ TREE  ------------
// const treeGp = new THREE.Group();
// const trunk_geo = new THREE.CylinderGeometry(0.5, 0.8, 8, 10);
// const trunk_material = new THREE.MeshStandardMaterial({ color: 0x806044 });
// const trunk_mesh = new THREE.Mesh(trunk_geo, trunk_material);
// trunk_mesh.position.y = 4;

// const branch_geo = new THREE.CylinderGeometry(0.2, 0.5, 4, 5);
// const branch_mesh = new THREE.Mesh(branch_geo, trunk_material);
// branch_mesh.rotation.x = 45;
// branch_mesh.rotation.z = 45;
// branch_mesh.position.y = 5.5;
// branch_mesh.position.x = -2;
// branch_mesh.position.z = 0.8;
// //branch mesh, clone count , random place, rotation
// const branch01_mesh = new THREE.Mesh(branch_geo, trunk_material);
// branch01_mesh.rotation.x = 45;
// branch01_mesh.rotation.z = -45;
// branch01_mesh.position.y = 5.5;
// branch01_mesh.position.x = 2;
// branch01_mesh.position.z = 0.8;

// treeGp.add(trunk_mesh, branch_mesh, branch01_mesh);
// scene.add(treeGp);
// tree_______branch_______ leaves
// function createTree() {
//   const tree = new THREE.Group();
//   const trunkGeometry = new THREE.CylinderGeometry(0.55, 0.8, 7, 9);
//   const trunkMaterial = new THREE.MeshStandardMaterial({
//     color: 0x806044,
//     roughness: 0.95,
//     metalness: 0,
//     emissive: 0x000000,
//     emissiveIntensity: 0,
//   });
//   const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
//   trunk.position.set(0, 3.5, 0);

//   //direction, geometry, material, position on trunk
//   const start = new THREE.Vector3(0, 3.5, 0);
//   const end = new THREE.Vector3(-2.2, 6.5, 0);
//   const direction = new THREE.Vector3().subVectors(end, start);
//   const length = direction.length();

//   const branchGeometry = new THREE.CylinderGeometry(0.08, 0.32, length, 8);
//   const branch = new THREE.Mesh(branchGeometry, trunkMaterial);

//   branch.position.copy(start).add(end).multiplyScalar(0.5); //position
//   branch.quaternion.setFromUnitVectors(
//     new THREE.Vector3(0, 1, 0),
//     direction.normalize(),
//   ); //rotation

//   const start1 = new THREE.Vector3(0, 4, 0);
//   const end1 = new THREE.Vector3(3, 7, 0);
//   const direction1 = new THREE.Vector3().subVectors(start1, end1);
//   const length1 = direction1.length();

//   const branch1Geometry = new THREE.CylinderGeometry(0.08, 0.32, length1);
//   const branch1 = new THREE.Mesh(branch1Geometry, trunkMaterial);
//   branch1.position.copy(start1).add(end1).multiplyScalar(0.5);
//   branch1.quaternion.setFromUnitVectors(
//     new THREE.Vector3(-2, 1, 0),
//     direction.normalize(),
//   ); //rotation

//   //leaves
//   const leafMaterial = new THREE.MeshBasicMaterial({
//     color: 0xffd8a1,
//     toneMapped: false,
//   });

//   const leafGeometry = new THREE.SphereGeometry(0.32, 9, 8);

//   for (let i = 0; i < 180; i++) {
//     const leaf = new THREE.Mesh(leafGeometry, leafMaterial);

//     const angle = Math.random() * Math.PI * 2;
//     const radius = Math.random() * 4;

//     leaf.position.set(
//       Math.cos(angle) * radius,
//       6 + Math.random() * 3,
//       Math.sin(angle) * radius,
//     );

//     leaf.scale.set(1 + Math.random() * 0.7, 0.6, 0.8);

//     tree.add(leaf);
//   }

//   tree.add(trunk, branch, branch1);
//   scene.add(tree);

//   return tree;
// }
// const forestTrees = [];
// const forestLights = new THREE.Group();
const forestLights = new THREE.Group();
scene.add(forestLights);
function createTree(x = 0, z = 0, scale = 1) {
  const tree = new THREE.Group();

  // TRUNK
  const trunkGeometry = new THREE.CylinderGeometry(0.55, 0.8, 7, 9);

  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x806044,
    roughness: 0.95,
    metalness: 0,
  });

  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(0, 3.5, 0);

  // BRANCH 1
  const start = new THREE.Vector3(0, 3.5, 0);
  const end = new THREE.Vector3(-2.2, 6.5, 0);

  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();

  const branchGeometry = new THREE.CylinderGeometry(0.08, 0.32, length, 8);

  const branch = new THREE.Mesh(branchGeometry, trunkMaterial);

  branch.position.copy(start).add(end).multiplyScalar(0.5);

  branch.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize(),
  );

  // BRANCH 2
  const start1 = new THREE.Vector3(0, 4, 0);
  const end1 = new THREE.Vector3(3, 7, 0);

  const direction1 = new THREE.Vector3().subVectors(end1, start1);
  const length1 = direction1.length();

  const branch1Geometry = new THREE.CylinderGeometry(0.08, 0.32, length1, 8);

  const branch1 = new THREE.Mesh(branch1Geometry, trunkMaterial);

  branch1.position.copy(start1).add(end1).multiplyScalar(0.5);

  branch1.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction1.clone().normalize(),
  );

  // LEAVES
  const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd8a1,
    emissive: 0xffb95e,
    emissiveIntensity: 0.5,
    roughness: 0.8,
  });

  const leafGeometry = new THREE.SphereGeometry(0.32, 9, 8);

  for (let i = 0; i < 5; i++) {
    const leaf = new THREE.Mesh(leafGeometry, leafMaterial);

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

  tree.add(trunk, branch, branch1);

  // TREE POSITION AND SCALE
  tree.position.set(x, 0, z);
  tree.scale.setScalar(scale);

  // GLOWING LIGHT
  const canopyLight = new THREE.PointLight(0xffd7a0, 0.75, 10);

  canopyLight.position.set(0, 6.8, 0);

  // Attach light to tree
  tree.add(canopyLight);

  scene.add(tree);

  return tree;
}

// function addGlowingForestTree(x, z, scale = 1) {
//   const forestTree = tree.clone(true);
//   forestTree.position.set(x, 0, z);
//   forestTree.scale.setScalar(scale);
//   forestTree.rotation.y = Math.random() * Math.PI * 2;

//   // Slight canopy tint variation while preserving the glowing look.
//   forestTree.traverse((part) => {
//     if (part.isMesh && part.geometry === originalLeafGeometry) {
//       part.material = originalLeafMaterial;
//     }
//     if (part.isMesh) {
//       part.castShadow = true;
//       part.receiveShadow = true;
//     }
//   });

//   scene.add(forestTree);
//   forestTrees.push(forestTree);

//   const canopyLight = new THREE.PointLight(0xffd7a0, 0.75, 10);
//   canopyLight.position.set(x, 6.8 * scale, z);
//   forestLights.add(canopyLight);
// }
// light for tree
// ------------ TREE FUNCTION ------------

// function createTree() {
//   const tree = new THREE.Group();

//   // TRUNK
//   const trunkMaterial = new THREE.MeshStandardMaterial({
//     color: 0x806044,
//     roughness: 1,
//   });

//   const trunk = new THREE.Mesh(
//     new THREE.CylinderGeometry(0.35, 0.55, 7, 8),
//     trunkMaterial,
//   );

//   trunk.position.y = 3.5;
//   tree.add(trunk);

//   // BRANCHES
//   function createBranch(start, end) {
//     const direction = new THREE.Vector3().subVectors(end, start);

//     const branch = new THREE.Mesh(
//       new THREE.CylinderGeometry(0.08, 0.25, direction.length(), 7),
//       trunkMaterial,
//     );

//     branch.position.copy(start).add(end).multiplyScalar(0.5);

//     branch.quaternion.setFromUnitVectors(
//       new THREE.Vector3(0, 1, 0),
//       direction.clone().normalize(),
//     );

//     tree.add(branch);
//   }

//   createBranch(new THREE.Vector3(0, 3.5, 0), new THREE.Vector3(-2, 6.5, 0));

//   createBranch(new THREE.Vector3(0, 4, 0), new THREE.Vector3(2, 6.5, 0));

//   createBranch(new THREE.Vector3(0, 5, 0), new THREE.Vector3(0, 8, 1));

//   // LEAVES
//   const leafColors = [0x71834e, 0x8e9162, 0x62784b, 0xa0a36c];

//   const clusters = [
//     [-2, 7, 0, 1.7],
//     [2, 7, 0, 1.8],
//     [0, 8, 1, 2],
//     [-1, 8.5, -1, 1.5],
//     [1, 9, -1, 1.6],
//   ];

//   clusters.forEach(([x, y, z, size]) => {
//     const leaves = new THREE.Mesh(
//       new THREE.SphereGeometry(1, 8, 8),
//       new THREE.MeshStandardMaterial({
//         color: leafColors[Math.floor(Math.random() * leafColors.length)],
//         roughness: 1,
//       }),
//     );

//     leaves.position.set(x, y, z);
//     leaves.scale.set(size, size * 0.8, size);

//     tree.add(leaves);
//   });

//   return tree;
// }

// ------------ TREE FUNCTION ------------

// function createTree() {
//   const tree = new THREE.Group();

//   // TRUNK
//   const trunkMaterial = new THREE.MeshStandardMaterial({
//     color: 0x806044,
//     roughness: 1,
//   });

//   const trunk = new THREE.Mesh(
//     new THREE.CylinderGeometry(0.35, 0.55, 7, 8),
//     trunkMaterial,
//   );

//   trunk.position.y = 3.5;
//   tree.add(trunk);

//   // BRANCHES
//   function createBranch(start, end) {
//     const direction = new THREE.Vector3().subVectors(end, start);

//     const branch = new THREE.Mesh(
//       new THREE.CylinderGeometry(0.08, 0.25, direction.length(), 7),
//       trunkMaterial,
//     );

//     branch.position.copy(start).add(end).multiplyScalar(0.5);

//     branch.quaternion.setFromUnitVectors(
//       new THREE.Vector3(0, 1, 0),
//       direction.clone().normalize(),
//     );

//     tree.add(branch);
//   }

//   createBranch(new THREE.Vector3(0, 3.5, 0), new THREE.Vector3(-2, 6.5, 0));

//   createBranch(new THREE.Vector3(0, 4, 0), new THREE.Vector3(2, 6.5, 0));

//   createBranch(new THREE.Vector3(0, 5, 0), new THREE.Vector3(0, 8, 1));

//   // LEAVES
//   const leafColors = [0x71834e, 0x8e9162, 0x62784b, 0xa0a36c];

//   const clusters = [
//     [-2, 7, 0, 1.7],
//     [2, 7, 0, 1.8],
//     [0, 8, 1, 2],
//     [-1, 8.5, -1, 1.5],
//     [1, 9, -1, 1.6],
//   ];

//   clusters.forEach(([x, y, z, size]) => {
//     const leaves = new THREE.Mesh(
//       new THREE.SphereGeometry(1, 8, 8),
//       new THREE.MeshStandardMaterial({
//         color: leafColors[Math.floor(Math.random() * leafColors.length)],
//         roughness: 1,
//       }),
//     );

//     leaves.position.set(x, y, z);
//     leaves.scale.set(size, size * 0.8, size);

//     tree.add(leaves);
//   });

//   return tree;
// }

// ------------ FOREST GENERATOR ------------

// const forest = [];

// const treeSpacing = 9;
// const forestRadius = 3;
// // const forestRadius = 6;

// for (let x = -forestRadius; x <= forestRadius; x++) {
//   for (let z = -forestRadius; z <= forestRadius; z++) {
//     // Leave a small starting area empty
//     if (Math.abs(x) <= 1 && Math.abs(z) <= 1) {
//       continue;
//     }

//     const tree = createTree();

//     tree.position.set(
//       x * treeSpacing + (Math.random() - 0.5) * 3,
//       0,
//       z * treeSpacing + (Math.random() - 0.5) * 3,
//     );

//     const scale = 0.7 + Math.random() * 0.6;

//     tree.scale.setScalar(scale);
//     tree.rotation.y = Math.random() * Math.PI * 2;

//     scene.add(tree);
//     forest.push(tree);
//   }
// }
//they line up , bug
// const forest = [];

// const treeSpacing = 9;
// const forestRadius = 3;
// const safeRadius = 5; // small empty area around player

// for (let x = -forestRadius; x <= forestRadius; x++) {
//   for (let z = -forestRadius; z <= forestRadius; z++) {
//     const posX = x * treeSpacing + (Math.random() - 0.5) * 3;
//     const posZ = z * treeSpacing + (Math.random() - 0.5) * 3;

//     // Skip trees only when too close to player
//     if (Math.hypot(posX, posZ) < safeRadius) {
//       continue;
//     }

//     const tree = createTree();

//     tree.position.set(posX, 0, posZ);

//     const scale = 0.7 + Math.random() * 0.6;

//     tree.scale.setScalar(scale);
//     tree.rotation.y = Math.random() * Math.PI * 2;

//     scene.add(tree);
//     forest.push(tree);
//   }
// }
// ------------ RANDOM FOREST ------------

// const forest = [];

// const forestRadius = 60;
// const treeCount = 50;
// const safeRadius = 6;

// for (let i = 0; i < treeCount; i++) {
//   const tree = createTree();

//   // Random position
//   const angle = Math.random() * Math.PI * 2;
//   const distance = safeRadius + Math.random() * (forestRadius - safeRadius);

//   const x = Math.cos(angle) * distance;
//   const z = Math.sin(angle) * distance;

//   tree.position.set(x, 0, z);

//   // Random size
//   const scale = 0.7 + Math.random() * 0.6;
//   tree.scale.setScalar(scale);

//   // Random rotation
//   tree.rotation.y = Math.random() * Math.PI * 2;

//   scene.add(tree);
//   forest.push(tree);
// }
// ------------ RANDOM FOREST ------------

// const forest = [];

// const forestRadius = 45;
// const treeCount = 30;
// const safeRadius = 3;
// const minDistance = 7;

// let attempts = 0;

// while (forest.length < treeCount && attempts < 1000) {
//   attempts++;

//   // Random position
//   const angle = Math.random() * Math.PI * 2;
//   const distance = safeRadius + Math.random() * (forestRadius - safeRadius);

//   const x = Math.cos(angle) * distance;
//   const z = Math.sin(angle) * distance;

//   // Check distance from existing trees
//   const tooClose = forest.some((tree) => {
//     const dx = tree.position.x - x;
//     const dz = tree.position.z - z;

//     return Math.sqrt(dx * dx + dz * dz) < minDistance;
//   });

//   if (tooClose) continue;

//   // Create tree
//   const tree = createTree();

//   tree.position.set(x, 0, z);

//   const scale = 0.7 + Math.random() * 0.6;
//   tree.scale.setScalar(scale);

//   tree.rotation.y = Math.random() * Math.PI * 2;

//   scene.add(tree);
//   forest.push(tree);
// }
// ------------ RANDOM FOREST ------------

const forest = [];

const forestRadius = 50;
const treeCount = 30;
const safeRadius = 3;
const minDistance = 6;

let attempts = 0;

while (forest.length < treeCount && attempts < 3000) {
  attempts++;

  // Random position across a square
  const x = (Math.random() - 0.5) * forestRadius * 2;
  const z = (Math.random() - 0.5) * forestRadius * 2;

  // Keep starting area clear
  if (Math.hypot(x, z) < safeRadius) continue;

  // Check distance between trees
  const tooClose = forest.some((tree) => {
    const dx = tree.position.x - x;
    const dz = tree.position.z - z;

    return Math.hypot(dx, dz) < minDistance;
  });

  if (tooClose) continue;

  const tree = createTree();

  tree.position.set(x, 0, z);

  const scale = 0.7 + Math.random() * 0.6;
  tree.scale.setScalar(scale);

  tree.rotation.y = Math.random() * Math.PI * 2;
  // add light to each tree
  // const pointLight = new THREE.PointLight(0xffd7a0, 0.75, 10);
  // pointLight.position.set(x, 6.8 , z);

  scene.add(tree);
  forest.push(tree);
}
// ------------ FOREST GENERATOR ------------

// const forest = [];

// const treeSpacing = 9;
// const forestRadius = 6;

// for (let x = -forestRadius; x <= forestRadius; x++) {
//   for (let z = -forestRadius; z <= forestRadius; z++) {
//     // Leave a small starting area empty
//     if (Math.abs(x) <= 1 && Math.abs(z) <= 1) {
//       continue;
//     }

//     const tree = createTree();

//     tree.position.set(
//       x * treeSpacing + (Math.random() - 0.5) * 3,
//       0,
//       z * treeSpacing + (Math.random() - 0.5) * 3,
//     );

//     const scale = 0.7 + Math.random() * 0.6;

//     tree.scale.setScalar(scale);
//     tree.rotation.y = Math.random() * Math.PI * 2;

//     scene.add(tree);
//     forest.push(tree);
//   }
// }

// ------------ ENDLESS FOREST ------------

// const recycleDistance = 54;
// const recycleRange = 108;

// function updateForest() {
//   forest.forEach((tree) => {
//     const dx = tree.position.x - mesh01.position.x;
//     const dz = tree.position.z - mesh01.position.z;

//     if (dx > recycleDistance) {
//       tree.position.x -= recycleRange;
//     } else if (dx < -recycleDistance) {
//       tree.position.x += recycleRange;
//     }

//     if (dz > recycleDistance) {
//       tree.position.z -= recycleRange;
//     } else if (dz < -recycleDistance) {
//       tree.position.z += recycleRange;
//     }
//   });
// }// ------------ ENDLESS FOREST ------------

const recycleDistance = 55;
const recycleRange = 110;

function updateForest() {
  forest.forEach((tree) => {
    const dx = tree.position.x - mesh01.position.x;
    const dz = tree.position.z - mesh01.position.z;

    // Move tree to the other side
    if (dx > recycleDistance) {
      tree.position.x -= recycleRange;
    } else if (dx < -recycleDistance) {
      tree.position.x += recycleRange;
    }

    if (dz > recycleDistance) {
      tree.position.z -= recycleRange;
    } else if (dz < -recycleDistance) {
      tree.position.z += recycleRange;
    }
  });
}

// ------------ ENDLESS FOREST ------------

// const recycleDistance = 54;
// const recycleRange = 108;

// function updateForest() {
//   forest.forEach((tree) => {
//     const dx = tree.position.x - mesh01.position.x;
//     const dz = tree.position.z - mesh01.position.z;

//     if (dx > recycleDistance) {
//       tree.position.x -= recycleRange;
//     } else if (dx < -recycleDistance) {
//       tree.position.x += recycleRange;
//     }

//     if (dz > recycleDistance) {
//       tree.position.z -= recycleRange;
//     } else if (dz < -recycleDistance) {
//       tree.position.z += recycleRange;
//     }
//   });
// }

//    ------------ PLANT MEMORY FLOWER  ------------
const btn_plantMain = document.querySelector(".btn_plantMain");
const message = document.querySelector(".message");
const userMemoryName = document.querySelector(".btn_userMemoryName");
const messageFromUser = document.querySelector("#messageFromUser");
const txt_warnPlant = document.querySelector(".txt_warnPlant");
const flowerColor = document.querySelector(".flowerColor");
const btn_plant = document.querySelector(".btn_plant");

//flower function

function createFlower(colorInput) {
  //stem
  //petal
  //position
  //transition
  const flowerPlant = new THREE.Group();
  const stem_geo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 10);
  const stem_Material = new THREE.MeshStandardMaterial({ color: 0x8e9162 });
  const stem_Mesh = new THREE.Mesh(stem_geo, stem_Material);
  stem_Mesh.scale.y = 0.1;
  stem_geo.translate(0, 0.4, 0);
  flowerPlant.position.set(mesh01.position.x + 1, 0, mesh01.position.z + 1);

  //clone, rotate
  const petals = new THREE.Group();
  const petalMeshes = [];
  for (let i = 0; i < 5; i++) {
    const petal_Mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 8, 8),
      new THREE.MeshStandardMaterial({ color: colorInput }),
    );

    // Distribute petals around the center
    const angle = (i / 5) * Math.PI * 2;
    petal_Mesh.position.x = Math.cos(angle) * 0.15;
    petal_Mesh.position.z = Math.sin(angle) * 0.15;
    petal_Mesh.position.y = 0.6;
    petal_Mesh.scale.set(0.01, 0.01, 0.01);

    petals.add(petal_Mesh);
    petalMeshes.push(petal_Mesh);
  }
  // petals.add(petalMeshes);
  flowerPlant.add(stem_Mesh, petals);
  scene.add(flowerPlant);
  console.log(colorInput);
  function animateFlower() {
    if (stem_Mesh.scale.y < 0.8) {
      stem_Mesh.scale.y += 0.2;
      // requestAnimationFrame(animateFlower);
    } else {
      petalMeshes.forEach((petal) => {
        if (petal.scale.x < 1) {
          petal.scale.set(
            petal.scale.x + 0.5,
            petal.scale.y + 0.3,
            petal.scale.z + 0.5,
          );
        }
      });
    }
    if (
      stem_Mesh.scale.y < 0.7 ||
      petalMeshes.some((petal) => petal.scale.x < 1)
    ) {
      requestAnimationFrame(animateFlower);
    }
  }
  animateFlower();
}
//  const flowerColors = [0xfff0ce, 0xffe5a4, 0xf9d9b6, 0xfff8e9];

//       const flowerGroup = new THREE.Group();

//       for (let i = 0; i < 400; i++) {
//         const x = (Math.random() - 0.5) * 85;
//         const z = (Math.random() - 0.5) * 85;

//         if (isInsideLake(x, z, 1.5)) continue;

//         const flower = new THREE.Group();
//         flower.position.set(x, 0.15, z);

//         const petalMaterial = new THREE.MeshBasicMaterial({
//           color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
//           toneMapped: false,
//         });

//         for (let p = 0; p < 5; p++) {
//           const angle = (p / 5) * Math.PI * 2;
//           const petal = new THREE.Mesh(
//             new THREE.SphereGeometry(0.13, 8, 8),
//             petalMaterial,
//           );

//           petal.position.set(Math.cos(angle) * 0.13, 0, Math.sin(angle) * 0.13);

//           petal.scale.set(1, 0.45, 1);
//           flower.add(petal);
//         }

//         flower.add(
//           new THREE.Mesh(
//             new THREE.SphereGeometry(0.07, 8, 8),
//             new THREE.MeshBasicMaterial({
//               color: 0xffd57b,
//               toneMapped: false,
//             }),
//           ),
//         );

//         flowerGroup.add(flower);
//       }

//       scene.add(flowerGroup);

btn_plantMain.addEventListener("click", () => {
  message.classList.toggle("active");
});
btn_plant.addEventListener("click", () => {
  if (userMemoryName.value === "" || messageFromUser.value === "") {
    txt_warnPlant.textContent = "Fill in the input";
  } else {
    console.log(userMemoryName.value, messageFromUser.value, flowerColor.value);
    userMemoryName.value = "";
    messageFromUser.value = "";
    createFlower(flowerColor.value);
    message.classList.toggle("active");
  }
});

// ------------ ECLIPSE LAKE ------------

const lakeX = 0;
const lakeZ = -15;
const lakeRadius = 8;

// Water surface
const lakeGeometry = new THREE.CircleGeometry(lakeRadius, 64);

const lakeMaterial = new THREE.MeshStandardMaterial({
  color: 0x8abae0,
  roughness: 0.4,
  metalness: 0.3,
});

const lake = new THREE.Mesh(lakeGeometry, lakeMaterial);
lake.rotation.x = -Math.PI / 2;
lake.position.set(lakeX, 0.05, lakeZ);
scene.add(lake);

// Eclipse ring
const eclipseRing = new THREE.Mesh(
  new THREE.TorusGeometry(lakeRadius + 0.3, 0.15, 8, 64),
  new THREE.MeshBasicMaterial({
    color: 0xaaa98a,
  }),
);

eclipseRing.rotation.x = Math.PI / 2;
eclipseRing.position.set(lakeX, 0.08, lakeZ);
scene.add(eclipseRing);

// Check lake position
function isInsideLake(x, z, extra = 0) {
  return Math.hypot(x - lakeX, z - lakeZ) < lakeRadius + extra;
}

// ------------ LAKE SOUND ------------

// ------------ LAKE SOUND ------------

// const waterSound = new Audio("./src/audio/waterstream.mp3");
// waterSound.loop = true;
// waterSound.volume = 0;

// let currentWaterVolume = 0;
// let targetWaterVolume = 0;

// function startWaterSound() {
//   waterSound.play().catch((error) => {
//     console.log("Water sound could not start:", error);
//   });
// }

// function updateLakeInteraction(delta) {
//   const distance = Math.hypot(
//     mesh01.position.x - lakeX,
//     mesh01.position.z - lakeZ,
//   );

//   const soundDistance = 30; // was 18; wider so the fade is gradual
//   const proximity = THREE.MathUtils.clamp(1 - distance / soundDistance, 0, 1);

//   targetWaterVolume = proximity * 0.7;

//   currentWaterVolume = THREE.MathUtils.damp(
//     currentWaterVolume,
//     targetWaterVolume,
//     2.5,
//     delta,
//   );

//   waterSound.volume = THREE.MathUtils.clamp(currentWaterVolume, 0, 1);
// }
//    ------------ RENDER  ------------
scene.background = new THREE.Color(0x777b4b);
scene.fog = new THREE.Fog(0x777b4b, 65, 155);
const renderer = new THREE.WebGLRenderer({ antialias: true });
//  renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.setSize(w, h);
garden.appendChild(renderer.domElement);
// composer & bloom
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.15,
  0.65,
  0.72,
);
composer.addPass(bloom);
// const clock = new THREE.Clock();
// const delta = clock.getDelta();
// LAKE SOUND
// updateLakeInteraction(delta);
function animate() {
  requestAnimationFrame(animate);

  camera.position.x =
    mesh01.position.x + Math.sin(cameraAngle) * cameraDistance;
  camera.position.z =
    mesh01.position.z + Math.cos(cameraAngle) * cameraDistance + 10;
  // camera.position.y = cameraHeight;
  camera.position.y = 10;
  camera.lookAt(mesh01.position);
  //   controls.update();
  // renderer.render(scene, camera);
  composer.render();
  //   console.log(btnColor.value.slice(1));
  //   // ENDLESS FOREST
  updateForest();

  //   // GROUND FOLLOW
  land_mesh.position.x = mesh01.position.x;
  land_mesh.position.z = mesh01.position.z;

  // const delta = clock.getDelta();
  // updateLakeInteraction(delta);
}

animate();

// function animate() {
//   requestAnimationFrame(animate);

//   // CAMERA FOLLOW
//   camera.position.x =
//     mesh01.position.x + Math.sin(cameraAngle) * cameraDistance;

//   camera.position.z =
//     mesh01.position.z + Math.cos(cameraAngle) * cameraDistance + 4;

//   camera.position.y = 10;

//   camera.lookAt(mesh01.position);

//   // ENDLESS FOREST
//   updateForest();

//   // GROUND FOLLOW
//   land_mesh.position.x = mesh01.position.x;
//   land_mesh.position.z = mesh01.position.z;

//   renderer.render(scene, camera);
// }

// animate();

// function animate() {
//   requestAnimationFrame(animate);

//   // CAMERA FOLLOW
//   camera.position.x =
//     mesh01.position.x + Math.sin(cameraAngle) * cameraDistance;

//   camera.position.z =
//     mesh01.position.z + Math.cos(cameraAngle) * cameraDistance + 4;

//   camera.position.y = 10;

//   camera.lookAt(mesh01.position);

//   // ENDLESS FOREST
//   updateForest();

//   // GROUND FOLLOW
//   land_mesh.position.x = mesh01.position.x;
//   land_mesh.position.z = mesh01.position.z;

//   renderer.render(scene, camera);
// }

// animate();
