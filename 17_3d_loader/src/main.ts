import { ModelViewer } from './Viewer';

const appElement = document.getElementById('app')!;
const viewer = new ModelViewer(appElement);

const select = document.getElementById('model-select') as HTMLSelectElement;
select.addEventListener('change', (e) => {
  const target = e.target as HTMLSelectElement;
  viewer.loadModel(target.value);
});

// 初期ロード
viewer.loadModel(select.value);