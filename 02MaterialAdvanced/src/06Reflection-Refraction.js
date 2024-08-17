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
  // reflection
  //envMap.mapping = THREE.EquirectangularReflectionMapping;
  // refraction
  envMap.mapping = THREE.EquirectangularRefractionMapping;
  scene.background = envMap;
  scene.environment = envMap;

  //  instantiating the loader
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./draco/");
  gltfLoader.setDRACOLoader(dracoLoader);
});

let thicknessMap = new THREE.TextureLoader().load(
  "./texture/diamond/diamond_emissive.png"
);

let normalMap = new THREE.TextureLoader().load(
  "./texture/diamond/diamond_normal.png"
);

let carbonNormal = new THREE.TextureLoader().load(
  "./texture/carbon/Carbon_Normal.png"
);

let scratchNormal = new THREE.TextureLoader().load(
  "./texture/carbon/Scratched_gold_01_1K_Normal.png"
);

const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshPhysicalMaterial({
  transparent: true,
  transmission: 0.95,
  roughness: 0.05,
  thickness: 2,
  attenuationColor: new THREE.Color(0.9, 0.9, 0),
  attenuationDistance: 1,
  //thicknessMap: thicknessMap,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

gui.add(cube.material, "attenuationDistance", 0, 10).name("Attenuation Distance");
gui.add(cube.material, "thickness", 0, 2).name("Thickness");

gui.add(cube.material, "ior", 0, 2).name("Refraction");
// reflectivity
gui.add(cube.material, "reflectivity", 0, 1).name("Reflection");
