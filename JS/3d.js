import * as THREE from 'three';
import { FBXLoader } from "https://cdn.jsdelivr.net/npm/three@0.173/examples/jsm/loaders/FBXLoader.js";
import { STLLoader } from "https://cdn.jsdelivr.net/npm/three@0.173/examples/jsm/loaders/STLLoader.js";


// Get the div where we want to render the scene
const container = document.getElementById('three-container');

// Ensure the container exists before rendering
if (!container) {
    console.error("No container found for Three.js!");
}

// Create scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 10);  // Move the camera further out to view the model better

// Create renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add lights
const light = new THREE.AmbientLight(0x404040, 1); // Ambient light with soft white color
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);


// Helper function to load the model
function loadModel(modelPath, modelName) {
    const loader = new STLLoader();
    loader.load(
        modelPath,
        (geometry) => {
            console.log(`${modelName} model loaded successfully!`);
            console.log("Loaded geometry:", geometry);

            // Create a mesh with the loaded geometry
            const material = new THREE.MeshPhongMaterial({
                color: 0xff000d, // Set the color to red (use any hex code you prefer)
                specular: 0x555555, // Add a specular highlight
                shininess: 30 // You can adjust the shininess for a shiny effect
            }); // You can change this to any material you prefer
            const mesh = new THREE.Mesh(geometry, material);

            // Center the model and ensure it is vertically aligned
            mesh.rotation.x = Math.PI / 2;
            mesh.rotation.y = 0;
            mesh.rotation.z = 50; // Rotate 90 degrees to align it vertically (if needed)

            // Position the model in the scene at the center
            mesh.position.set(0, 10, 0);  // Place it at the center (0, 0, 0)

            // Add the mesh to the scene
            scene.add(mesh);

            // Optional: Scale or adjust position if necessar

            console.log(`${modelName} added to the scene`);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded'); // Log loading progress
        },
        (error) => {
            console.error(`Error loading the ${modelName} model:`, error);
        }
    );
}


// **Load Haelix V1 and V2 models**
loadModel('../MODELS/dna.stl', 'dna');


// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the DNA helix models (if they are loaded)
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
            //child.rotation.y += 0.001; // Rotate the models
            child.rotation.z += 0.01;
            //child.rotation.x +=0.01


        }
    });

    renderer.render(scene, camera);
}

animate();

// Handle resizing
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
