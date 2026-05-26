const API = 'api/dashboard.php';

document.addEventListener('DOMContentLoaded', () => {
    loadSummary();
    loadRevenue();
    loadOrders();
    loadProducts();
});

async function api(action) {
    const res = await fetch(`${API}?action=${action}`);
    return res.json();
}

// ── KPI Cards ──
async function loadSummary() {
    const { data } = await api('summary');
    if (!data) return;

    const fmt = (v, prefix = '') => {
        if (v >= 1000) return prefix + (v / 1000).toFixed(1) + 'k';
        return prefix + v.toLocaleString();
    };

    document.getElementById('kpi-revenue').textContent = '$' + fmt(data.revenue.value);
    document.getElementById('kpi-orders').textContent = fmt(data.orders.value);
    document.getElementById('kpi-customers').textContent = fmt(data.customers.value);
    document.getElementById('kpi-conversion').textContent = data.conversion.value + '%';

    ['revenue', 'orders', 'customers', 'conversion'].forEach(key => {
        const el = document.getElementById(`change-${key}`);
        const val = data[key].change;
        const up = val >= 0;
        el.className = `kpi-change ${up ? 'up' : 'down'}`;
        el.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                ${up ? '<polyline points="18 15 12 9 6 15"/>' : '<polyline points="6 9 12 15 18 9"/>'}
            </svg>
            ${Math.abs(val)}%
        `;
    });
}

// ── Revenue Chart ──
async function loadRevenue() {
    const { data } = await api('revenue');
    if (!data) return;

    const canvas = document.getElementById('revenue-chart');
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width - 40;
    canvas.height = 220;

    const pad = { top: 20, right: 12, bottom: 28, left: 50 };
    const w = canvas.width - pad.left - pad.right;
    const h = canvas.height - pad.top - pad.bottom;

    const revenues = data.map(d => d.revenue);
    const expenses = data.map(d => d.expenses);
    const labels = data.map(d => d.month);

    const max = Math.max(...revenues, ...expenses) * 1.1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = pad.top + (h * i / 4);
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(canvas.width - pad.right, y); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.font = '10px system-ui'; ctx.textAlign = 'right';
        ctx.fillText('$' + Math.round((max - max * i / 4) / 1000) + 'k', pad.left - 8, y + 3);
    }

    // Bar width
    const barWidth = Math.min(w / data.length * 0.35, 20);
    const gap = 3;

    data.forEach((d, i) => {
        const x = pad.left + (w * (i + 0.5) / data.length);
        const revH = (d.revenue / max) * h;
        const expH = (d.expenses / max) * h;

        // Revenue bar
        ctx.fillStyle = '#0070f3';
        roundRect(ctx, x - barWidth - gap/2, pad.top + h - revH, barWidth, revH, 3);

        // Expense bar
        ctx.fillStyle = '#262626';
        roundRect(ctx, x + gap/2, pad.top + h - expH, barWidth, expH, 3);

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '10px system-ui'; ctx.textAlign = 'center';
        ctx.fillText(d.month, x, canvas.height - 6);
    });
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.fill();
}

// ── Orders Table ──
async function loadOrders() {
    const { data } = await api('orders');
    if (!data) return;

    const tbody = document.getElementById('orders-body');
    tbody.innerHTML = data.map(o => `
        <tr>
            <td><span class="cell-id">${o.id}</span></td>
            <td>${o.customer}</td>
            <td>${o.product}</td>
            <td><span class="cell-amount">$${o.amount.toFixed(2)}</span></td>
            <td><span class="badge badge-${o.status}">${o.status}</span></td>
            <td>${formatDate(o.date)}</td>
        </tr>
    `).join('');
}

// ── Products ──
async function loadProducts() {
    const { data } = await api('products');
    if (!data) return;

    const list = document.getElementById('products-list');
    list.innerHTML = data.map((p, i) => `
        <div class="product-row">
            <div class="product-rank">${i + 1}</div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-meta">${p.sales} sales</div>
            </div>
            <div>
                <div class="product-value">$${(p.revenue / 1000).toFixed(1)}k</div>
                <div class="product-trend ${p.growth >= 0 ? 'up' : 'down'}">${p.growth >= 0 ? '+' : ''}${p.growth}%</div>
            </div>
        </div>
    `).join('');
}

function formatDate(d) {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

window.addEventListener('resize', () => { loadRevenue(); });
