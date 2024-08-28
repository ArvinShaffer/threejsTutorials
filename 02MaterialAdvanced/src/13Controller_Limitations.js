import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000 
);

const renderer = new THREE.WebGLRenderer({
  antialias: true, 
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 0;
camera.position.y = 1.8;
camera.position.x = 5;
camera.lookAt(0, 1.2, 0);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 1.2, 0);
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 5;
controls.minPolarAngle = Math.PI / 2 - Math.PI / 12;
controls.maxPolarAngle = Math.PI / 2;
controls.minAzimuthAngle = Math.PI / 2 - Math.PI / 12;
controls.maxAzimuthAngle = Math.PI / 2 + Math.PI / 12;

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
  Fullscreen: function() {
    document.body.requestFullscreen();
    console.log("Fullscreen");
  },
  ExitFullscreen: function() {
    document.exitFullscreen();
    console.log("Exit Fullscreen");
  }
}

const gui = new GUI();
gui.add(eventObj, "Fullscreen");
gui.add(eventObj, "ExitFullscreen");

let rgbeLoader = new RGBELoader();
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularRefractionMapping;
  scene.background = new THREE.Color(0xe2d0e0);
  scene.environment = envMap;

  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./draco/");
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load(
    "./model/liveroom-scene.glb",
    (gltf) => {
      console.log(gltf);
      scene.add(gltf.scene);
    }
  );
});

