import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth / window.innerHeight,
  0.1, 
  1000
);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
document.body.appendChild(renderer.domElement);

camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;

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
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
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
  envMap.mapping = THREE.EquirectangularRefractionMapping;
  scene.background = new THREE.Color(0xe2d0e0);
  scene.environment = envMap;
});

const loader = new THREE.ObjectLoader();
loader.load("./model/damon/scene.json", (object) => {
  scene.add(object);
});

