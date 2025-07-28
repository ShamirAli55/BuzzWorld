import './src/style.css';
import * as THREE from 'three';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    RGBELoader
} from 'three/examples/jsm/loaders/RGBELoader.js';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(5, 5, 5);
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.width = 2048;
// directionalLight.shadow.mapSize.height = 2048;
// directionalLight.shadow.camera.near = 0.5;
// directionalLight.shadow.camera.far = 50;
// directionalLight.shadow.camera.left = -10;
// directionalLight.shadow.camera.right = 10;
// directionalLight.shadow.camera.top = 10;
// directionalLight.shadow.camera.bottom = -10;
// scene.add(directionalLight);

// const pointLight1 = new THREE.PointLight(0xff6b6b, 1, 10);
// pointLight1.position.set(2, 2, 2);
// scene.add(pointLight1);

// const pointLight2 = new THREE.PointLight(0x4ecdc4, 1, 10);
// pointLight2.position.set(-2, -2, 2);
// scene.add(pointLight2);

// const pointLight3 = new THREE.PointLight(0x45b7d1, 1, 10);
// pointLight3.position.set(0, 3, -2);
// scene.add(pointLight3);

let model;
let mixer;

const loader = new GLTFLoader();
const rgbeLoader = new RGBELoader();


loader.load('assets/predator/scene.glb', (gltf) => {
        // Add the model to the scene
        model = gltf.scene;
        scene.add(model);

        model.position.x = 2.2;
        model.rotation.y = -1;
        model.position.z = 1.2;

        model.rotation.y = 7;

        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();
        // mixer.clipAction(gltf.animations[1]).play();
        // mixer.clipAction(gltf.animations[2]).play();
        // console.log(gltf.animations);
        console.log('GLTF model loaded successfully');

    }, undefined,
    (error) => {
        console.error('An error occurred loading the GLTF model:', error);
    })

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas"),
    antialias: true,
    alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;



const ambientLight = new THREE.AmbientLight(0xfffffff, 3);
scene.add(ambientLight);

const topLight = new THREE.AmbientLight(0xffffff, 0.3);
topLight.position.set(500, 500, 500);
scene.add(topLight);


// Setup orbit controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.05;
// controls.screenSpacePanning = false;
// controls.minDistance = 1;
// controls.maxDistance = 10;
// controls.maxPolarAngle = Math.PI;


window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


function animate() {
    window.requestAnimationFrame(animate);

    // controls.update();

    renderer.render(scene, camera);

    if (mixer) mixer.update(0.02);
}

animate();


let posModel = [{
        id: "home",
        position: {
            x: 2.2,
            y: -1,
            z: 1.2
        },
        rotation: {
            x: 0,
            y: 7,
            z: 0
        },
    },
    {
        id: "about",
        position: {
            x: -3,
            y: 0,
            z: 1.2
        },
        rotation: {
            x: 0,
            y: 1.7,
            z: 0
        },
    },
    {
        id: "services",
        position: {
            x: 4,
            y: 0,
            z: 0
        },
        rotation: {
            x: 0,
            y: -0.9,
            z: 0
        },
    },
    {
        id: "contact",
        position: {
            x: -3,
            y: 0,
            z: 1.2
        },
        rotation: {
            x: 0,
            y: 1.7,
            z: 0
        },
    },
];

function modelMove() {
    if (!model) return; // Don't run if model is not ready

    const sections = document.querySelectorAll("section");
    let currentSection;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
            currentSection = section.id;
        }
    });

    console.log(currentSection);
    let pos_active = posModel.findIndex(
        (val) => val.id == currentSection
    );

    if (pos_active >= 0) {
        let newcoordinates = posModel[pos_active];

        gsap.to(model.position, {
            x: newcoordinates.position.x,
            y: newcoordinates.position.y,
            z: newcoordinates.position.z,
            duration: 2.5,
            ease: "power2.out"
        });

        gsap.to(model.rotation, {
            x: newcoordinates.rotation.x,
            y: newcoordinates.rotation.y,
            z: newcoordinates.rotation.z,
            duration: 1.3,
            ease: "power2.out"
        });
    }
}

window.addEventListener('scroll', () => {
    if (model)
        modelMove()
});


let cursor = document.querySelector("#cursor");
document.addEventListener("mousemove", (dets) => {
    gsap.to(cursor, {
        left: dets.x - 15 + "px",
        top: dets.y - 15 + "px",
        duration: 1,
        ease: "power2.out"
    });
})

const ImageAnimation = () => {
    let container = document.querySelector(".card-container");
    let fixed = document.querySelector(".fixed");
    container.addEventListener("mouseenter", () => {
        fixed.style.display = "block";
    });
    container.addEventListener("mouseleave", () => {
        fixed.style.display = "none";
    })

    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.addEventListener("mouseover", () => {
            let image = card.getAttribute("data-img");
            fixed.style.backgroundImage = `url(${image})`;
        })
    })
}
ImageAnimation();
document.body.style.overflow = "hidden";
var load = document.querySelector("#loader");
setTimeout(function () {
    document.body.style.overflow = "auto";
    load.style.top = "-100%";
}, 4200);