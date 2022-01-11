import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



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
const dt = 0.003
const rho = 28.0
const sigma = 10.0
const beta = 8.0 / 3.0
function lorenzAttractor(point) {
  const x = point.position.x;
  const y = point.position.y;
  const z = point.position.z;

  point.position.x += (sigma * (y - x)) * dt;
  point.position.y += (x * (rho - z) - y) * dt;
  point.position.z += (x * y - beta * z) * dt;

  // point.geometry.attributes.position.needsUpdate = true;
  return point;
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  points.map(x => lorenzAttractor(x))

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

// Generate all the initial points
const points = Array(200).fill().map(x => addPoint());

// And run it all
controls.update();
animate();
