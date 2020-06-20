"use strict";

const THREE = require("three");

const Perlin = require("./perlin.js").Perlin;

const camera, scene, renderer, geometry, terrain, perlin;

const rows = 75;
const cols = 75;
const flying = 0;

init();

function init() {
  perlin = new Perlin();
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 1, -15);
  camera.lookAt(scene.position);

  geometry = new THREE.PlaneGeometry(40, 40, rows - 1, cols - 1);

  geometry.dynamic = true;

  terrain = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
  );

  applyNoise();

  scene.add(terrain);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  render();
}

function render() {
  requestAnimationFrame(render);
  applyNoise();

  flying -= 0.05;

  terrain.rotation.x = Math.PI / 3;

  renderer.render(scene, camera);
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function applyNoise() {
  terrain.geometry.verticesNeedUpdate = true;

  const yOffset = flying;
  const xOffset = 0;

  for (let y = 0; y < rows * cols; y += rows) {
    yOffset += 0.1;
    xOffset = 0;
    for (let x = 0; x < cols; x++) {
      terrain.geometry.vertices[x + y].z = mapRange(
        perlin.noise(xOffset, yOffset),
        0,
        1,
        -0.7,
        0.7
      );
      xOffset += 0.1;
    }
  }
}
