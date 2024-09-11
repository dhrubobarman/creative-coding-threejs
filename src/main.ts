import "./style.css";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import getLayer from "./getLayer";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createElement, getSphearePoint } from "./utils";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const canvas = createElement("canvas");
const container = createElement("div", { id: "container" });
const stats = new Stats();
stats.showPanel(1);
container.appendChild(stats.dom);

// const palette = [0x808080, 0x858585, 0x7a7a7a] as const;
const palette = [0x7c80f7] as const;

const getRandomColor = () =>
  palette[Math.floor(Math.random() * palette.length)];

const bgColor = 0x0033bb;

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(bgColor, 0.05);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 20;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(w, h);

const ctrls = new OrbitControls(camera, renderer.domElement);
ctrls.enableDamping = true;

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.4, 0, 0);

const composser = new EffectComposer(renderer);
composser.addPass(renderScene);
composser.addPass(bloomPass);

const geometry = new THREE.BoxGeometry();

function getBox() {
  const color = getRandomColor();
  const material = new THREE.MeshBasicMaterial({
    color: color,
  });
  const mesh = new THREE.Mesh(geometry, material);
  const pos = getSphearePoint(4);
  mesh.position.copy(pos);
  mesh.scale.setScalar(1);
  mesh.rotation.x = Math.random() * Math.PI;
  mesh.rotation.y = Math.random() * Math.PI;

  const upperScale = 2.5;
  mesh.scale.set(
    0.1 + Math.random() * upperScale,
    0.1 + Math.random() * upperScale,
    0.1 + Math.random() * upperScale
  );

  const edges = new THREE.EdgesGeometry(geometry);
  const lines = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      fog: false,
    })
  );
  lines.scale.setScalar(1.01);

  mesh.add(lines);

  const axisProbability = Math.random() * 3;
  const allAxes = ["x", "y", "z"] as const;
  const axis = allAxes[Math.floor(axisProbability)];
  const rate = Math.random() * 0.002 + 0.005;
  mesh.userData = {
    update: () => {
      mesh.rotation[axis] += rate;
    },
  };
  return mesh;
}

const boxGroup = new THREE.Group();

boxGroup.userData.update = () => {
  boxGroup.rotation.y += 0.002;
  boxGroup.children.forEach((child) => {
    child.userData.update();
  });
};

const numBoxes = 150;
for (let i = 0; i < numBoxes; i += 1) {
  const box = getBox();
  boxGroup.add(box);
}
scene.add(boxGroup);

// Sprites BG
const gradientBackground = getLayer({
  numSprites: 8,
  opacity: 0.1,
  radius: 14,
  size: 24,
  hex: bgColor,
  z: -15.5,
});

gradientBackground.scale.setScalar(2.5);
scene.add(gradientBackground);

function animate() {
  requestAnimationFrame(animate);
  boxGroup.userData.update();
  composser.render();
  ctrls.update();
  stats.update();
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
