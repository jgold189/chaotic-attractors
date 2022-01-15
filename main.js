import './style.css';
import { attractors } from './attractors';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';


let settings = {
    numPoints: 200,
    attractor: attractors.Lorenz,
    enableTrails: true,
    dt: 0.003
};
let points = [];
let scene, camera, renderer, stats;


function createGUI() {
    const gui = new GUI( { name: 'Settings' } );
    // This setting does nothing yet
    gui.add(settings, 'enableTrails').name("Enable Trails?");

    gui.add(settings, 'dt',  0.001, 0.07).name('Speed');
    gui.add(settings, 'numPoints', 1, 500).step(1).name('Points').onChange(setupPoints);
    gui.add(settings, 'attractor', attractors).name("Attractor").onChange(setupPoints);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// Sets everything up
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#can'),
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);
    camera.position.setY(15);
    renderer.render(scene, camera);
    
    const grid = new THREE.GridHelper(200, 50);
    scene.add(grid);
    
    const controls = new OrbitControls(camera, renderer.domElement);

    stats = new Stats();
    document.body.appendChild(stats.dom)

    window.addEventListener( 'resize', onWindowResize );
    
    createGUI();
    
    // Generate all the initial points
    setupPoints();
    
    controls.update();
}

// Create a fresh set of points
function setupPoints() {
    points.forEach(point => {
      point.geometry.dispose();
      point.material.dispose();
      scene.remove(point);
    });
    points = Array(settings.numPoints).fill().map(x => addPoint());
}

// Adds a new 'random' point to the scene
function addPoint(low = 0.001, high = 0.9) {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);

    // Random hex color
    const randomColor = parseInt(Math.floor(Math.random()*16777215).toString(16), 16);
  
    const material = new THREE.MeshBasicMaterial({ color: randomColor });
    const point = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloat(low, high));

    point.position.set(x, y, z);
    scene.add(point);
    return point;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    points.forEach(x => settings.attractor(x, settings.dt));

    renderer.render(scene, camera);
    stats.update();
}


init()
animate();
