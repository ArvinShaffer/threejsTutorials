import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

camera.position.z = 0;
camera.position.y = 1.8;
camera.position.x = 5;
camera.lookAt(0, 1.2, 0);

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

const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "./model/Duck.glb",
  (gltf) => {
    console.log(gltf);
    scene.add(gltf.scene);
    let duckMesh = gltf.scene.getObjectByName("LOD3spShape");
    let matcapTexture = new THREE.TextureLoader().load(
      "./texture/matcaps/54584E_B1BAC5_818B91_A7ACA3-512px.png"
    );
    let preMaterial = duckMesh.material;
    duckMesh.material = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
      map: preMaterial.map,
    });
  }
);
 
