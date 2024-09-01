import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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

let textureLoader = new THREE.TextureLoader();
let texture = textureLoader.load("./texture/amber/base_color.jpg");

let planeGeometry = new THREE.PlaneGeometry(1, 1);
let planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: texture,
    //transparent: true,
});

let plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

//texture.repeat.set(4, 4);
// set horizontal repeat
//texture.wrapS = THREE.RepeatWrapping;

// Set the horizontal repeat mode to mirror repeat
//texture.wrapT = THREE.MirroredRepeatWrapping;

// Set vertical repeat
//texture.wrapT = THREE.RepeatWrapping;

// texture offset 
//texture.offset.set(0.5, 0.5);


// texture rotation
texture.center.set(0.5, 0.5);
texture.rotation = Math.PI / 4;





