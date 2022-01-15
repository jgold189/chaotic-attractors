import './style.css';
import { attractors } from './attractors';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';


const settings = {
    numPoints: 100,
    attractor: attractors.Lorenz,
    enableTrails: true,
    uniformColors: true,
    dt: 0.006,
    restart: setupPoints,
};

// The maximum number of points a trail line will contain
const MAX_LINE_POINTS = 2500;

let points = [];
let lines = [];
let scene, camera, renderer, stats, iterNum;


function createGUI() {
    const gui = new GUI( { name: 'Settings' } );

    gui.add(settings, 'enableTrails').name('Enable Trails?').onChange(toggleLines);
    gui.add(settings, 'uniformColors').name('Uniform Colors?').onChange(setupPoints);

    gui.add(settings, 'dt',  0.003, 0.02).name('Speed');
    gui.add(settings, 'numPoints', 1, 250).step(1).name('Points').onChange(setupPoints);
    gui.add(settings, 'attractor', attractors).name("Attractor").onChange(setupPoints);

    gui.add(settings, 'restart').name('Restart');
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
    lines.forEach(line => {
        line.geometry.dispose();
        line.material.dispose();
        scene.remove(line);
      });
    points = Array(settings.numPoints).fill().map(() => addPoint());
    lines = Array(settings.numPoints).fill().map((x, i) => addLine(points[i]));
    iterNum = 1;
    toggleLines();
}


// Adds a new 'random' point to the scene
function addPoint(low = 0.001, high = 0.9) {
    const geometry = new THREE.SphereGeometry(0.24, 20, 10);

    let matColor;
    if (settings.uniformColors) {
        matColor = 0xFFFF00;
    } else {
        // Random hex color
        matColor = parseInt(Math.floor(Math.random()*16777215).toString(16), 16);
    }
  
    const material = new THREE.MeshBasicMaterial({ color: matColor });
    const point = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloat(low, high));

    point.position.set(x, y, z);
    scene.add(point);
    return point;
}


// Creates a new line relating to the starting point
function addLine(startingPoint) {
    const positions = new Float32Array(MAX_LINE_POINTS * 3);
    // Set the first point
    positions[0] = startingPoint.position.x;
    positions[1] = startingPoint.position.y;
    positions[2] = startingPoint.position.z;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    geometry.setDrawRange(0, 1);

    const material = new THREE.LineBasicMaterial({ color: startingPoint.material.color });
    const line = new THREE.Line(geometry,  material);
    scene.add(line);
    return line;
}


// Updates a line with a new point
function updateLine(line, point) {
    if (iterNum <= MAX_LINE_POINTS) {
        
        // Positions are stored in a 1d array with every 3 being the x,y,z of a vertex
        line.geometry.attributes.position.array[iterNum * 3] = point.position.x;
        line.geometry.attributes.position.array[iterNum * 3 + 1] = point.position.y;
        line.geometry.attributes.position.array[iterNum * 3 + 2] = point.position.z;

        line.geometry.setDrawRange(0, Math.min(iterNum, MAX_LINE_POINTS));

        line.geometry.attributes.position.needsUpdate = true;
        line.geometry.computeBoundingBox();
        line.geometry.computeBoundingSphere();
    }
}


// Toggles whether or not the lines are showing in the scene
// NOTE: Even if the lines are not showing they are still being updated
function toggleLines() {
    if (settings.enableTrails) {
        lines.forEach(x => scene.add(x));
    } else {
        lines.forEach(x => scene.remove(x));
    }
}


// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (iterNum <= MAX_LINE_POINTS) {
        iterNum++;
    }

    points.forEach((x, i) => {
        settings.attractor(x, settings.dt);
        updateLine(lines[i], x)
    });

    renderer.render(scene, camera);
    stats.update();
}


init()
animate();
