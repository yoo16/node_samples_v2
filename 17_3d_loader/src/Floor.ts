import * as THREE from 'three';

export class Floor {
    public mesh: THREE.Mesh;

    constructor(size: number = 100, divisions: number = 50) {
        // 1. タイル模様のテクスチャを作成
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d')!;

        // 背景色
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 128, 128);
        // タイル色（互い違いに塗る）
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillRect(64, 64, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(divisions, divisions);

        // 2. 地面のメッシュ作成
        const geometry = new THREE.PlaneGeometry(size, size);
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(geometry, material);
        // 水平にするための回転
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.y = 0; // 足元の高さ
    }

    // 床をシーンに追加するためのヘルパー
    public addTo(scene: THREE.Scene) {
        scene.add(this.mesh);
    }
}