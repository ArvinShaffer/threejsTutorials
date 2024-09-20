import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { TGALoader } from "three/examples/jsm/loaders/TGALoader";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader";

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
    transparent: true,
});

let plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

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

// texture.generateMipmaps = true;

let maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
texture.anisotropy = 4;
console.log(maxAnisotropy);

//jpg/png texture load
// textureLoader.load(
//   "./texture/opt/env/Alex_Hart-Nature_Lab_Bones_2k.jpg",
//   (texture) => {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     console.log("jpg/png", texture);
//     scene.background = texture;
//     scene.environment = texture;
//     plane.material.map = texture;
//     texture.magFilter = THREE.LinearFilter;
//     texture.minFilter = THREE.LinearMipMapLinearFilter;
//     texture.anisotropy = 16;
//   }
// );

// ktx2 loader;
// let ktx2Loader = new KTX2Loader()
//   .setTranscoderPath("basis/")
//   .detectSupport(renderer);
// let ktx2Texture = ktx2Loader.load(
//   "./texture/opt/ktx2/Alex_Hart-Nature_Lab_Bones_2k_uastc-mip-triangle.ktx2",
//   (texture) => {
//     console.log("ktx2", texture);
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     // texture.magFilter = THREE.LinearFilter;
//     // texture.minFilter = THREE.LinearMipMapLinearFilter;
//     texture.anisotropy = 16;
//     // 不起效果texture.flipY = true;
//     texture.needsUpdate = true;
//     scene.background = texture;
//     scene.environment = texture;
//     plane.material.map = texture;
//   }
// );

// dds loader
// let ddsLoader = new DDSLoader();
// let ddsTexture = ddsLoader.load(
//   "./texture/opt/env/Alex_Hart-Nature_Lab_Bones_2k_bc3_nomip.dds",
//   (texture) => {
//     console.log("dds", texture);
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     texture.flipY = true;
//     texture.needsUpdate = true;
//     scene.background = texture;
//     scene.environment = texture;
//     plane.material.map = texture;
//     texture.center = new THREE.Vector2(0.5, 0.5);
//     texture.rotation = Math.PI;
//     texture.magFilter = THREE.LinearFilter;
//     texture.minFilter = THREE.LinearMipMapLinearFilter;
//     texture.anisotropy = 16;
//   }
// );

// Alex_Hart - Nature_Lab_Bones_2k_bc7.tga;
// tga loader texture
let tgaLoader = new TGALoader();
tgaLoader.load(
  "./texture/opt/env/Alex_Hart-Nature_Lab_Bones_2k-mipmap.tga",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    console.log("tga", texture);
    scene.background = texture;
    scene.environment = texture;
    plane.material.map = texture;
  }
);