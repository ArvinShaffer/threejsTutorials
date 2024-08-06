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

// rgbeLoader load hdr
let rgbeLoader = new RGBELoader();
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    //scene.background = envMap;
    //scene.environment = envMap;
});

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
gltfLoader.setDRACOLoader(dracoLoader);


// gltfLoader.load(
//     "./model/building.glb",
//     (gltf) => {
//         console.log(gltf);
//         scene.add(gltf.scene);
//         let building = gltf.scene.children[0];
//         let geometry = building.geometry;

//         // get edges geometry
//         // let edgesGeometry = new THREE.EdgesGeometry(geometry);
//         let edgesMaterial = new THREE.LineBasicMaterial({
//             color: 0xffffff,
//         });
        
//         // get wireframe geometry
//         let edgesGeometry = new THREE.WireframeGeometry(geometry);
//         let edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

//         // update building world matrix
//         building.updateWorldMatrix(true, true);
//         edges.matrix.decompose(edges.position, edges.quaternion, edges.scale);

//         scene.add(edges);
//     }
// );

gltfLoader.load(
    "./model/city.glb",
    (gltf) => {
        console.log(gltf);
        scene.add(gltf.scene);
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                let building = child;
                let geometry = building.geometry;

                // get edges geometry
                //let edgesGeometry = new THREE.EdgesGeometry(geometry);
                let edgesMaterial = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                });

                let edgesGeometry = new THREE.WireframeGeometry(geometry);
                let edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

                // update buildings world matrix
                building.updateWorldMatrix(true, true);
                edges.matrix.copy(building.matrixWorld);
                edges.matrix.decompose(edges.position, edges.quaternion, edges.scale);

                scene.add(edges);
            }
        });
    }
);







