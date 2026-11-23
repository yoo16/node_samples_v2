// 共通ヘッダーを挿入 + ユーティリティ
const links = [
    ['/', 'Home'],
    ['/feeds', 'Feeds'],
    ['/users', 'Users'],
    ['/sql-client', 'SQL Client'],
];

const here = location.pathname;
document.getElementById('header').innerHTML = `
<header class="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
  <div class="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
    <a href="/" class="flex items-center gap-2 font-semibold tracking-tight">
      <span class="inline-block size-2.5 rounded-full bg-neutral-900"></span>Node SQLite
    </a>
    <nav class="flex gap-1 text-sm">
      ${links.map(([href, label]) => `
        <a href="${href}" class="rounded-md px-3 py-1.5 transition ${href === here
        ? 'bg-neutral-100 font-medium text-neutral-900'
        : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}">${label}</a>`).join('')}
    </nav>
  </div>
</header>`;

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// SQLite の CURRENT_TIMESTAMP は UTC
export const fmtDate = (s) => new Date(s.replace(' ', 'T') + 'Z')
    .toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export const api = async (url, options) => {
    const res = await fetch(url, options);
    return res.json();
};

export const postJson = (url, body) => api(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
});

// Endpoint / SQL / Message パネルを更新
export const showStatus = ({ endpoint, sql, message, errors }) => {
    document.getElementById('endpoint').textContent = endpoint ?? '';
    document.getElementById('sql').textContent = sql ?? '';
    const msg = document.getElementById('message');
    msg.textContent = errors?.length ? errors.map((e) => e.msg).join(', ') : (message ?? '');
    msg.className = errors?.length ? 'font-mono text-red-600' : 'font-mono text-neutral-600';
};

export const initials = (name) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
