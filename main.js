// JavaScript file for Three.js Portfolio Website

import * as THREE from 'three';

let scene, camera, renderer;
let shapes = [];
let scrollProgress = 0;
const maxScroll = 100; // Adjust this value to control the total "scroll" range
const shapesPerScroll = maxScroll / 5; // 5 shapes total

init();
animate();

function init() {
  scene = new THREE.Scene();

  const aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
  camera.position.z = 15;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  createShapes();

  document.body.style.height = `${window.innerHeight * 2}px`;

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('scroll', onScroll);
}

function createShapes() {
  const shapeTypes = [
    new THREE.BoxGeometry(4, 6, 0.5),  // Top left square
    new THREE.BoxGeometry(20, 2, 0.5),  // Top right rectangle
    new THREE.BoxGeometry(4, 4, 0.5),  // Left tall rectangle
    new THREE.BoxGeometry(6, 4, 0.5),  // Bottom middle rectangle
    new THREE.BoxGeometry(2, 4, 0.5)   // Bottom right small rectangle
  ];

  const positions = [
    { x: -10.25, y: 3.25 },   // Top left
    { x: 2.25, y: 5.25 },    // Top right
    { x: -6.25, y: -2.25 },  // Left
    { x: 1.25, y: -2.25 },   // Bottom middle
    { x: 5.75, y: -2.25 }    // Bottom right
  ];

  for (let i = 0; i < shapeTypes.length; i++) {
    const geometry = shapeTypes[i];
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const border = new THREE.LineSegments(edges, lineMaterial);

    const shape = new THREE.Mesh(geometry, material);
    shape.add(border);

    // Start shapes off-screen
    shape.position.set(positions[i].x, positions[i].y - 20, 0);

    shapes.push({ 
      mesh: shape, 
      targetY: positions[i].y, 
      startY: positions[i].y - 20 
    });
    scene.add(shape);
  }
}

function animate() {
  requestAnimationFrame(animate);

  shapes.forEach((shape, index) => {
    const progress = Math.min(Math.max(scrollProgress - index * shapesPerScroll, 0), shapesPerScroll) / shapesPerScroll;
    const targetY = shape.startY + (shape.targetY - shape.startY) * progress;
    shape.mesh.position.y += (targetY - shape.mesh.position.y) * 0.1; // Smooth animation
  });

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onScroll() {
  scrollY = window.scrollY;
}

// Use mouse wheel or touch events to control the "scroll" progress
function onWheel(event) {
  event.preventDefault();
  scrollProgress = Math.min(Math.max(scrollProgress + event.deltaY * 0.1, 0), maxScroll);
}

window.addEventListener('wheel', onWheel, { passive: false });

// For touch devices
let touchStartY;
function onTouchStart(event) {
  touchStartY = event.touches[0].clientY;
}

function onTouchMove(event) {
  if (touchStartY) {
    const touchY = event.touches[0].clientY;
    const deltaY = touchStartY - touchY;
    scrollProgress = Math.min(Math.max(scrollProgress + deltaY * 0.1, 0), maxScroll);
    touchStartY = touchY;
  }
}

window.addEventListener('touchstart', onTouchStart);
window.addEventListener('touchmove', onTouchMove);

document.body.style.overflow = 'auto';