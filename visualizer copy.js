// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Append the renderer's DOM element to the 'container' div
// document.getElementsByClassName('container').appendChild(renderer.domElement);
const containerElements = document.getElementsByClassName('container');
if (containerElements.length > 0) {
    const container = containerElements[0]; // Get the first element with the class 'container'
    container.appendChild(renderer.domElement);
} else {
    console.error("No element with class 'container' found.");
}

// Function to load and parse SVG data
function loadSVG(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const svgData = xhr.responseText;
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgData, 'image/svg+xml');
            callback(svgDoc);
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}

// Load your SVG and create a 2D shape
loadSVG('output_outline.svg', function (svgDoc) {
    const paths = svgDoc.getElementsByTagName('path');
    
    const svgPaths = [];
    for (const path of paths) {
        // Convert the path data to Three.js format
        const pathData = path.getAttribute('d');
        const shapes = THREE.ShapeUtils.extractPoints(pathData);
        
        const shape = new THREE.Shape(shapes);
        svgPaths.push(shape);
    }
    
    // Extrude the 2D shape to create a 3D geometry
    const extrudeSettings = { depth: 1, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(svgPaths, extrudeSettings);
    
    // Create a material (you can add textures, colors, etc., to the material)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    
    // Create a mesh using the geometry and material
    const mesh = new THREE.Mesh(geometry, material);
    
    // Add the mesh to the scene
    scene.add(mesh);
    
    // Set up lighting (optional)
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 1);
    scene.add(light);
    
    // Render loop
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };
    
    animate();
});
