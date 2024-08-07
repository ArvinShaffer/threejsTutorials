import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth / window.innerHeight,
  0.1, 
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true, // Enable anti-aliasing
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(0, 0, 0);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
// controls.autoRotate = true;

function animate() {
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

let eventObj = {
  Fullscreen: function () {
    document.body.requestFullscreen();
    console.log("Full Screen");
  },
  ExitFullscreen: function () {
    document.exitFullscreen();
    console.log("Exit Full Screen");
  },
};

const gui = new GUI();
gui.add(eventObj, "Fullscreen").name("Full Screen");
gui.add(eventObj, "ExitFullscreen").name("Exit Full Screen");

let rgbeLoader = new RGBELoader();
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = envMap;
  scene.environment = envMap;
});

// ambient light
let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// point light
let pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 3, 0);
scene.add(pointLight);

// add texture
let textureLoader = new THREE.TextureLoader();
let colorTexture = textureLoader.load("./texture/watercover/CityNewYork002_COL_VAR1_1K.png");
colorTexture.colorSpace = THREE.SRGBColorSpace;

let specularTexture = textureLoader.load(
  "./texture/watercover/CityNewYork002_GLOSS_1K.jpg"
);

let normalTexture = textureLoader.load(
  "./texture/watercover/CityNewYork002_NRM_1K.jpg"
);

let dispTexture = textureLoader.load(
  "./texture/watercover/CityNewYork002_DISP_1K.jpg"
);

let aoTexture = textureLoader.load(
  "./texture/watercover/CityNewYork002_AO_1K.jpg"
);


// create plane
let planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200);
// let planeMaterial = new THREE.MeshPhongMaterial({
//   map: colorTexture,
//   specularMap: specularTexture,
//   transparent: true,
//   normalMap: normalTexture,
//   bumpMap: dispTexture,
//   displacementMap: dispTexture,
//   displacementScale: 0.02,
//   aoMap: aoTexture,
// });

let planeMaterial = new THREE.MeshLambertMaterial({
  map: colorTexture,
  specularMap: specularTexture,
  transparent: true,
  normalMap: normalTexture,
  bumpMap: dispTexture,
  displacementMap: dispTexture,
  displacementScale: 0.02,
  aoMap: aoTexture,
});

let plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);