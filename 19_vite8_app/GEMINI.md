# GEMINI.md: Vite 8 + Three.js 3D RPG 開発ガイド

## 1. Core Stack

* **Framework**: Vite 8 (Rolldown enabled)
* **Language**: TypeScript (Strict)
* **3D Engine**: Three.js
* **Model**: `/public/models/lizard_kin_warrior_character_rig.glb`

```treeview
my-3d-rpg/
├── public/                 # 静的アセット（パスの起点は "/"）
│   └── models/
│       └── lizard_kin_warrior_character_rig.glb
├── src/                    # ソースコード
│   ├── main.ts             # エントリーポイント（AIが主に書く場所）
│   ├── style.css           # 全画面表示用のスタイル
│   └── vite-env.d.ts       # 型定義
├── .env                    # 環境変数
├── index.html              # 描画用 canvas の土台
├── package.json            # 依存関係（Vite 8, Three.js）
├── tsconfig.json           # TypeScript 設定
├── vite.config.ts          # Vite 8 / Rolldown 設定
└── GEMINI.md   # AIへの指示書（ここから指示をコピペ）
```

## 2. Global System Prompt

あなたはシニア・ゲームエンジニアです。Vite 8 のモダンなエコシステムを最大限に活用し、以下の要件を満たすクリーンで再利用可能なコードを生成してください。

### 【実装要件：トカゲ戦士の操作】

1. **Model Loading & Initialization**
* `GLTFLoader` を使用。
* すべての Mesh に対して `castShadow = true` を再帰的に適用。
* `sRGBColorSpace` を適用し、正しい色調でレンダリングする。


2. **Animation Architecture**
* `AnimationMixer` を使用し、`Idle` と `Walk` の 2 状態を管理。
* `crossFadeTo` を実装し、移動・停止時に 0.4s で自然に遷移させる。
* ループ処理内では `THREE.Clock` の `getDelta()` を使用すること。


3. **Physics-less Movement**
* キーボード（WASD/Arrows）入力を正規化（Normalize）し、斜め移動で加速しないようにする。
* 進行方向へ `Quaternion.slerp` を用いてスムーズに回転させる。
* 地面（PlaneGeometry）との接地を保ちつつ、座標を更新する。


4. **Smooth Follow Camera (TPS)**
* `CameraTarget` をプレイヤーの少し上に配置。
* `Vector3.lerp` を使い、キャラクターの背後に遅延（Smoothing）を持たせて追従させる。

## 3. Vibe Coding Commands (AIへの指示テンプレ)

### CMD A: 基盤構築 (Scaffolding)

> 「Vite 8 + Three.js のボイラープレートを作成して。`main.ts` 1 ファイルで完結させ、`lizard_kin_warrior_character_rig.glb` を読み込んで中央に表示。影を有効にした DirectionalLight も追加して。」

### CMD B: モーション・コントローラー (Controller)

> 「今のコードに移動ロジックを追加して。WASD でトカゲが走り回り、移動中は Walk アニメーション、止まれば Idle になるように。`crossFadeTo` を使って動きをヌルヌルにして。」

### CMD C: カメラ最適化 (Camera Polish)

> 「カメラを TPS 視点にアップグレードして。プレイヤーを真後ろから追うのではなく、`Vector3.lerp` を使って、旋回や移動時に少し遅れてついてくる高級感のあるカメラワークにして。」

---

## 4. Troubleshooting for Vite 8

* **HMR Issue**: Vite 8 で HMR が効きすぎる場合は、`if (import.meta.hot)` ブロックで古い Renderer を破棄する処理を追加させること。
* **Asset Path**: 常に `/models/` パス（public基準）を意識させること。

## 1. 環境構築 (Setup)

### Vite 8 プロジェクトの作成

最新の Rust 製エンジン `Rolldown` を活用した Vite 8 を使用します。

```bash
# プロジェクトの作成
npm create vite@beta my-3d-rpg -- --template vanilla-ts
cd my-3d-rpg
npm install

# 3D 開発に必要なライブラリのインストール
npm install three @types/three

```

## 2. 3D アセットの準備 (Assets)

### 推奨ファイル形式

* **GLB (.glb)**: Web 開発の標準。テクスチャもアニメーションも 1 つにまとまっていて扱いやすい。

### 素材の入手先

* **[Fab.com](https://www.fab.com/)**: 高品質なモデルが豊富。
* **[Mixamo](https://www.mixamo.com/)**: アニメーション（歩く、走る等）を自動付与できる。

### 配置場所
ダウンロードした `lizard_kin_warrior_character_rig.glb` は以下のディレクトリに配置
`public/models/lizard_kin_warrior_character_rig.glb`

## 3. 基本コードテンプレート (`main.ts`)

キャラクターを表示し、最初のアニメーションをループ再生する最小構成です。

```typescript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// --- シーン・カメラ・レンダラーの設定 ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace; // 色を鮮やかに
document.body.appendChild(renderer.domElement);

// --- ライト ---
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// --- GLB モデルの読み込み ---
const loader = new GLTFLoader();
let mixer: THREE.AnimationMixer;

loader.load('/models/lizard_kin_warrior_character_rig.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        // コンソールでアニメーション名を確認
        console.log("利用可能なモーション:", gltf.animations.map(a => a.name));
        
        // 最初のアニメーションを再生
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
    }
});

// --- ゲームループ ---
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta); // アニメーションの時間を進める
    renderer.render(scene, camera);
}
animate();

```