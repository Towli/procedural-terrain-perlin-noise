"use strict";

/**
 * todo:
 * > remove magic numbers
 * > create hooks for variables for client-side manipulation
 * > move some scoped variables to global for above
 */

import {
  Scene,
  PerspectiveCamera,
  PlaneGeometry,
  Mesh,
  MeshBasicMaterial,
  WebGLRenderer,
  FaceColors,
} from "three";

const Perlin = require("./perlin.js").Perlin;

let camera, scene, renderer, geometry, terrain, perlin;

const terrainOptions = {
  width: 40,
  height: 40,
  rows: 90,
  cols: 90,
};

let noiseDisplacement = 0;

init();

function init() {
  perlin = new Perlin();
  scene = new Scene();

  camera = new PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 1, 15);
  camera.lookAt(scene.position);

  geometry = new PlaneGeometry(
    terrainOptions.width,
    terrainOptions.height,
    terrainOptions.rows - 1,
    terrainOptions.cols - 1
  );

  terrain = new Mesh(
    geometry,
    new MeshBasicMaterial({
      color: 0xffffff,
      wireframe: false,
      transparent: false,
      vertexColors: FaceColors,
      overdraw: true,
    })
  );

  terrain.geometry.verticesNeedUpdate = true;
  terrain.geometry.colorsNeedUpdate = true;

  applyNoise();

  scene.add(terrain);

  renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  render();
}

function render() {
  requestAnimationFrame(render);
  applyNoise();

  noiseDisplacement -= 0.05;

  terrain.rotation.x = Math.PI / -3;

  renderer.render(scene, camera);
}

function applyNoise() {
  let yOffset = noiseDisplacement;
  let xOffset = 0;

  for (
    let y = 0;
    y < terrainOptions.rows * terrainOptions.cols;
    y += terrainOptions.rows
  ) {
    yOffset += 0.1;
    xOffset = 0;
    for (let x = 0; x < terrainOptions.cols; x++) {
      terrain.geometry.vertices[x + y].z = mapRange(
        perlin.noise(xOffset, yOffset),
        0,
        1,
        -1,
        1
      );
      xOffset += 0.1;
    }
  }

  colorByDepth();

  terrain.geometry.verticesNeedUpdate = true;
  terrain.geometry.colorsNeedUpdate = true;
}

function colorByDepth() {
  const colorSpread = 10;

  terrain.geometry.faces.forEach((face) => {
    var zDepth = terrain.geometry.vertices[face.a].z;
    face.color.setRGB(
      (zDepth / colorSpread) * 10,
      (zDepth / colorSpread) * 3 + 0.7,
      (zDepth / colorSpread) * 200 + 3
    );
  });
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
