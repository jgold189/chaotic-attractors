import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';


let settings = {
  numPoints: 200,
  attractor: lorenzAttractor,
  dt: 0.003
};
let points = [];


function createGUI() {
  const gui = new GUI( { name: 'Settings' } );
  gui.add(settings, 'dt',  0.001, 0.1).name('Speed');
  gui.add(settings, 'numPoints', 1, 500).name('Points').onChange(setupPoints);
  gui.add(settings, 'attractor', {Lorenz: lorenzAttractor}).name("Attractor").onChange(setupPoints);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function setupPoints() {
  points.forEach(point => {
    point.geometry.dispose();
    point.material.dispose();
    scene.remove(point);
  });
  points = Array(settings.numPoints).fill().map(x => addPoint());
}

// Adds a new random point to the scene
function addPoint() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);

  // Random hex color
  const randomColor = parseInt(Math.floor(Math.random()*16777215).toString(16), 16);

  const material = new THREE.MeshBasicMaterial({ color: randomColor });
  const point = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloat(0.001, 0.9));

  point.position.set(x, y, z);
  scene.add(point);
  return point;
}

// Updates a point according to the Lorenz Attractor
//const dt = 0.003
const rho = 28.0
const sigma = 10.0
const beta = 8.0 / 3.0
function lorenzAttractor(point) {
  const x = point.position.x;
  const y = point.position.y;
  const z = point.position.z;

  point.position.x += (sigma * (y - x)) * settings.dt;
  point.position.y += (x * (rho - z) - y) * settings.dt;
  point.position.z += (x * y - beta * z) * settings.dt;

  return point;
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  points.map(x => settings.attractor(x))

  renderer.render(scene, camera);
}



// Setting everything up
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#can'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setY(15);
renderer.render(scene, camera);

// Grid
const grid = new THREE.GridHelper(200, 50);
scene.add(grid);

// Camera controls
const controls = new OrbitControls(camera, renderer.domElement);

createGUI();

window.addEventListener( 'resize', onWindowResize );

// Generate all the initial points
setupPoints();

// And run it all
controls.update();
animate();
