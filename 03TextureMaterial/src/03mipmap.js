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
//let texture = textureLoader.load("./texture/uv_grid_opengl.jpg");
let texture = textureLoader.load("./texture/brick/brick_diffuse.jpg");

let planeGeometry = new THREE.PlaneGeometry(1, 1);
let planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: texture,
    //transparent: true,
});

let plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

//texture.flipY = false;
//texture.flipY = true;

texture.colorSpace = THREE.SRGBColorSpace;
//scene.background = new THREE.Color(0xffffff);

//texture.magFilter = THREE.NearestFilter;
//texture.magFilter = THREE.LinearFilter;

//texture.minFilter = THREE.NearestFilter;
//texture.minFilter = THREE.LinearFilter;

//texture.minFilter = THREE.NearestMipmapNearestFilter;
texture.minFilter = THREE.LinearMipMapLinearFilter;
//texture.minFilter = THREE.NearestMipmapLinearFilter;
//texture.minFilter = THREE.LinearMipMapNearestFilter;

texture.generateMipmaps = true;

let maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
texture.anisotropy = 4;
console.log(maxAnisotropy);
