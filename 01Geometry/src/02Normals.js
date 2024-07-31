import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper.js";


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

let uvTexture = new THREE.TextureLoader().load("./texture/uv_grid_opengl.jpg");

const planeGeometry = new THREE.PlaneGeometry(2, 2);
console.log(planeGeometry);

const planeMaterial = new THREE.MeshBasicMaterial({
    map: uvTexture,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
planeMesh.position.x = -3;

const geometry = new THREE.BufferGeometry();
// const vertices = new Float32Array([
//     -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0,
//     1.0, 1.0, 0, -1.0, 1.0, 0, -1.0, -1.0, 0,
// ])
// geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

const vertices = new Float32Array([
    -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0,
]);

geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
geometry.setIndex(new THREE.BufferAttribute(indices, 1));

// set uv coordinate
const uv = new Float32Array([
    0, 
    0,
    1,
    0,
    1,
    1,
    0,
    1,
])
// create uv attribute
geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));

// set normals
const normals = new Float32Array([
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
]);
// create normals attribute
geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));

// compute Vertex Normals
//geometry.computeVertexNormals();

console.log(geometry);

// create material
const material = new THREE.MeshBasicMaterial({
    map: uvTexture,
});
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
plane.position.x = 3;

// create vertexNormalsHelper
const helper = new VertexNormalsHelper(plane, 0.2, 0xff0000);
scene.add(helper);

// set camera position
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(0, 0, 0);

// add axes helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
//controls.autoRotate = true;

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
        console.log("Full screen");
    },
    ExitFullscreen: function () {
        document.exitFullscreen();
        console.log("Exit full screen");
    },
};

const gui = new GUI();
gui.add(eventObj, "Fullscreen").name("Fullscreen")
gui.add(eventObj, "ExitFullscreen").name("Exit Fullscreen");


// rgbeLoader 
let rgbeLoader = new RGBELoader();
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
    (envMap) => { 
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = envMap;
        scene.environment = envMap;
        planeMaterial.envMap = envMap;
        material.envMap = envMap;
});
