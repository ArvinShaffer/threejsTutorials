import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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

// Renderer function
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


// Three small balls
let sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({
        color: 0xff0000,
    })
);
sphere1.position.x = -3;
scene.add(sphere1);

let sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({
        color: 0x00ff00,
    })
);
sphere2.position.x = 0;
scene.add(sphere2);

let sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshBasicMaterial({
        color: 0x0000ff,
    })
);
sphere3.position.x = 3;
scene.add(sphere3);

var box = new THREE.Box3();
let arrSphere = [sphere1, sphere2, sphere3];

for (let i = 0; i < arrSphere.length; i++)
{
    // console.log(scene.children[i].name)
    // arrSphere[i].geometry.computeBoundingBox();
    // let box3 = arrSphere[i].geometry.boundingBox;
    // arrSphere[i].updateWorldMatrix(true, true);
    // box3.applyMatrix4(arrSphere[i].matrixWorld);
    
    let box3 = new THREE.Box3().setFromObject(arrSphere[i]);
    box.union(box3);
}

console.log(box);
let boxHelper = new THREE.Box3Helper(box, 0xffff00);
scene.add(boxHelper);


