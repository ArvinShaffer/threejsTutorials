import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"


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


// rgbeLoader 
let rgbeLoader = new RGBELoader();
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
    (envMap) => { 
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = envMap;
        scene.environment = envMap;
});

// Instantiating the loader
const gltfLoader = new GLTFLoader();

// load model
gltfLoader.load(
    // model path
    "./model/Duck.glb",
    (gltf) => {
        console.log(gltf);
        scene.add(gltf.scene);
        let duckMesh = gltf.scene.getObjectByName("LOD3spShape");
        let duckGeometry = duckMesh.geometry;

        // coumpute BounddingBox
        duckGeometry.computeBoundingBox();
        // set geometry center
        // duckGeometry.center();
        let duckBox = duckGeometry.boundingBox;

        // update world matrix
        duckMesh.updateWorldMatrix(true, true);
        // update bounding box
        duckBox.applyMatrix4(duckMesh.matrixWorld);

        // get bounding box center point
        let center = duckBox.getCenter(new THREE.Vector3());
        console.log(center);
        
        // create box helper
        let boxHelper = new THREE.Box3Helper(duckBox, 0xffff00);

        // add box helper
        scene.add(boxHelper);
        console.log(duckBox);
        console.log(duckMesh);


        // get bounding sphere
        let duckSphere = duckGeometry.boundingSphere;
        duckSphere.applyMatrix4(duckMesh.matrixWorld);
        console.log(duckSphere);
        let sphereGeometry = new THREE.SphereGeometry(duckSphere.radius, 16, 16);
        let sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
        });
        let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereMesh.position.copy(duckSphere.center);
        scene.add(sphereMesh);
    }
);








