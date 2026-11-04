import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 10, 100);

let zoomLevel = 1.0;          // ズーム倍率（1.0が標準）
const minZoom = 0.1;         // 最短距離（キャラクターに寄る）
const maxZoom = 10.0;         // 最遠距離（キャラクターから離れる）
const zoomSpeed = 0.01;       // ズームの速さ

const width = window.innerWidth;
const height = window.innerHeight;
const aspect = width / height;
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// --- Lights ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.mapSize.set(1024, 1024);
scene.add(dirLight);

// --- Ground ---
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0x888888, depthWrite: true })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const grid = new THREE.GridHelper(100, 100, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

// --- Character & Animation ---
let mixer: THREE.AnimationMixer;
let model: THREE.Group;
let currentAction: THREE.AnimationAction;
let actions: { [key: string]: THREE.AnimationAction } = {};

const loader = new GLTFLoader();
const modelPath = '/models/lizard_kin_warrior_character_rig.glb';

loader.load(modelPath, (gltf) => {
    model = gltf.scene;
    model.scale.setScalar(0.5);
    model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        actions[clip.name] = action;
    });

    // Initial action (fallback to first animation if 'Idle' not found)
    const idleName = gltf.animations.find(a => a.name.toLowerCase().includes('idle'))?.name || gltf.animations[0]?.name;
    if (idleName && actions[idleName]) {
        currentAction = actions[idleName];
        currentAction.play();
    }

    console.log("Animations loaded:", Object.keys(actions));
}, undefined, (error) => {
    console.error('An error happened while loading the model:', error);
});

// --- Input Handling ---
const keys: { [key: string]: boolean } = {};
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

// --- TPS Camera Config ---
const cameraOffset = new THREE.Vector3(0, 5, 10);
const cameraTarget = new THREE.Vector3();

// --- Mouse Camera Rotation ---
let cameraYaw = 0;           // 水平回転角度（ラジアン）
let isDragging = false;
let lastMouseX = 0;
const mouseRotateSpeed = 0.005;

renderer.domElement.addEventListener('mousedown', (e) => {
    if (e.button === 0) { isDragging = true; lastMouseX = e.clientX; }
});
window.addEventListener('mouseup', () => { isDragging = false; });
window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    cameraYaw -= (e.clientX - lastMouseX) * mouseRotateSpeed;
    lastMouseX = e.clientX;
});

// --- Movement Variables ---
const moveSpeed = 5;
const turnSpeed = 10;

// --- Animation Transition ---
function fadeToAction(name: string, duration: number) {
    const nextAction = actions[name];
    if (nextAction && nextAction !== currentAction) {
        nextAction.reset().fadeIn(duration).play();
        if (currentAction) {
            currentAction.fadeOut(duration);
        }
        currentAction = nextAction;
    }
}

// --- Game Loop ---
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    if (model) {
        const moveVector = new THREE.Vector3();
        if (keys['KeyW'] || keys['ArrowUp']) moveVector.z -= 1;
        if (keys['KeyS'] || keys['ArrowDown']) moveVector.z += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) moveVector.x -= 1;
        if (keys['KeyD'] || keys['ArrowRight']) moveVector.x += 1;

        if (moveVector.length() > 0) {
            moveVector.normalize();

            // Animation state
            const walkName = Object.keys(actions).find(n => n.toLowerCase().includes('walk')) || Object.keys(actions)[0];
            if (walkName) fadeToAction(walkName, 0.4);

            // Movement
            const angle = Math.atan2(moveVector.x, moveVector.z);
            const targetRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
            model.quaternion.slerp(targetRotation, turnSpeed * delta);

            const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(model.quaternion);
            model.position.add(direction.multiplyScalar(moveSpeed * delta));

            // 1. キャラクターの少し上をターゲットにする
            const targetPos = model.position.clone().add(new THREE.Vector3(0, 1.5, 0));
            cameraTarget.lerp(targetPos, 0.1);

            // 2. 基本のオフセット(cameraOffset)に現在のズーム倍率を掛ける
            const zoomedOffset = cameraOffset.clone().multiplyScalar(zoomLevel);

            // 3. cameraYaw で水平回転させ、キャラクターの位置に足す
            const yawQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), cameraYaw);
            const idealOffset = zoomedOffset.applyQuaternion(yawQuat).add(model.position);

            // 4. 滑らかにカメラを移動
            camera.position.lerp(idealOffset, 0.1);
            camera.lookAt(cameraTarget);
        } else {
            const idleName = Object.keys(actions).find(n => n.toLowerCase().includes('idle')) || Object.keys(actions)[0];
            if (idleName) fadeToAction(idleName, 0.4);
        }

        // Camera Follow (cameraYaw で水平回転)
        const targetPos = model.position.clone().add(new THREE.Vector3(0, 1.5, 0));
        cameraTarget.lerp(targetPos, 0.1);

        const yawQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), cameraYaw);
        const currentOffset = cameraOffset.clone().multiplyScalar(zoomLevel);
        const idealOffset = currentOffset.applyQuaternion(yawQuat).add(model.position);

        camera.position.lerp(idealOffset, 0.1);
        camera.lookAt(cameraTarget);
    }

    updateDebug();
    renderer.render(scene, camera);
}

// --- Debug Overlay ---
const debugDiv = document.createElement('div');
debugDiv.style.cssText = 'position:fixed;top:8px;left:8px;color:#0f0;font:12px monospace;background:rgba(0,0,0,0.5);padding:6px 10px;border-radius:4px;pointer-events:none;white-space:pre;';
document.body.appendChild(debugDiv);

function updateDebug() {
    const p = camera.position;
    debugDiv.textContent =
        `Camera: (${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)})\n` +
        `Zoom:   ${zoomLevel.toFixed(2)}\n` +
        `Yaw:    ${(cameraYaw * 180 / Math.PI).toFixed(1)}°`;
}

animate();

// --- Handle Resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Zoom Handling ---
window.addEventListener('wheel', (e) => {
    zoomLevel += e.deltaY * zoomSpeed;
    zoomLevel = THREE.MathUtils.clamp(zoomLevel, minZoom, maxZoom);
}, { passive: true });