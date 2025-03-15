import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

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
            const material = new THREE.MeshNormalMaterial(); // You can change this to any material you prefer
            const mesh = new THREE.Mesh(geometry, material);

            // Center the model and ensure it is vertically aligned
            mesh.rotation.z = Math.PI / 2;
            mesh.rotation.y = 0;
            mesh.rotation.z = 0; // Rotate 90 degrees to align it vertically (if needed)

            // Position the model in the scene at the center
            mesh.position.set(0, 0, 0);  // Place it at the center (0, 0, 0)

            // Add the mesh to the scene
            scene.add(mesh);

            // Optional: Scale or adjust position if necessary
            mesh.scale.set(0.05, 0.05, 0.05);  // Ensure the model is visible

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
loadModel('models/DNA-Haelix-v1.stl', 'Haelix V1');
loadModel('models/DNA-Haelix-v2.stl', 'Haelix V2');

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the DNA helix models (if they are loaded)
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
            //child.rotation.y += 0.01; // Rotate the models
            //child.rotation.z += 0.01;


        }
    });

    renderer.render(scene, camera);

    // Log the number of objects in the scene (helps verify if the models are loaded)
    console.log("Objects in the scene:", scene.children.length);
}

animate();

// Handle resizing
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
