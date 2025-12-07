import { defineConfig } from 'vite';

export default defineConfig({
    root: 'client',              // ソースフォルダ
    publicDir: '../public',      // 静的ファイル
    build: {
        outDir: '../public',     // 出力先を Express が参照できるように
        emptyOutDir: true
    },
    server: {
        port: 5173,              // Vite開発サーバ
        strictPort: true,
        hmr: true
    }
});