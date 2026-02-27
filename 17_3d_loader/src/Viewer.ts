import * as THREE from 'three';
import { Floor } from './Floor';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class ModelViewer {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: InstanceType<typeof OrbitControls>;
    private loader: InstanceType<typeof FBXLoader>;
    private mixer: THREE.AnimationMixer | null = null;
    private currentModel: THREE.Group | null = null;
    private lastTime: number = 0;

    constructor(container: HTMLElement) {
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        this.lastTime = performance.now();

        // 1. シーン設定
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xcccccc);

        // 2. カメラ設定
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 2, 5);

        // 3. レンダラー設定
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(this.renderer.domElement);

        // 4. 操作設定
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        // 5. fbx ロード設定
        this.loader = new FBXLoader();

        // 6. ライト設定
        this.addLights();
        // 7. 床設定
        this.addFloor();

        // 8. アニメーション開始（arrow functionでthisを固定）
        this.animate();

        // 9. リサイズ対応
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    private addLights() {
        // 環境光
        const ambient = new THREE.AmbientLight(0xffffff, 2.0);
        // 太陽光
        const direct = new THREE.DirectionalLight(0xffffff, 3.0);
        direct.position.set(5, 10, 7.5);
        this.scene.add(ambient, direct);
    }

    private addFloor() {
        // コンポーネント化した Floor を作成
        const floor = new Floor(100, 40);
        floor.addTo(this.scene);

        // 補助用のグリッドも重ねて表示するとより見やすい
        const grid = new THREE.GridHelper(100, 20, 0x888888, 0xcccccc);
        this.scene.add(grid);
    }

    public loadModel(path: string) {
        if (this.currentModel) {
            this.scene.remove(this.currentModel);
        }

        // FBXファイルをロード
        this.loader.load(path, (object: THREE.Group) => {
            object.scale.set(0.01, 0.01, 0.01);
            this.currentModel = object;
            this.scene.add(object);

            if (object.animations.length > 0) {
                this.mixer = new THREE.AnimationMixer(object);
                this.mixer.clipAction(object.animations[0]).play();
            }
        }, undefined, (err: ErrorEvent) => {
            console.error("Load Error:", err);
        });
    }

    private animate = () => {
        // アニメーションループの開始
        requestAnimationFrame(this.animate);

        // 前フレームからの経過時間（秒）を計算
        const currentTime = performance.now();
        const delta = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // アニメーションミキサーを更新
        if (this.mixer) {
            this.mixer.update(delta);
        }

        // カメラ操作の更新
        this.controls.update();
        // レンダリング
        this.renderer.render(this.scene, this.camera);
    }

}