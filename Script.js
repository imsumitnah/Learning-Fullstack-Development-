const chart = document.querySelector('#priceChart');
const ctx = chart.getContext('2d');
const positionSizeOutput = document.querySelector('#positionSize');
const capitalInput = document.querySelector('#capitalInput');
const riskInput = document.querySelector('#riskInput');
const stopInput = document.querySelector('#stopInput');

const signals = [
    { symbol: 'NIFTY', side: 'BUY', setup: 'Breakout retest above VWAP', confidence: 87, tone: 'up' },
    { symbol: 'BANKNIFTY', side: 'BUY', setup: 'EMA 20/50 momentum continuation', confidence: 82, tone: 'up' },
    { symbol: 'BTCUSDT', side: 'WAIT', setup: 'High volatility; wait for pullback', confidence: 71, tone: '' },
    { symbol: 'RELIANCE', side: 'SELL', setup: 'Resistance rejection with weak volume', confidence: 76, tone: 'down' }
];

const watchlist = [
    { symbol: 'NIFTY', price: '22,688.40', change: '+0.62%', tone: 'up' },
    { symbol: 'BANKNIFTY', price: '48,214.10', change: '+0.88%', tone: 'up' },
    { symbol: 'BTCUSDT', price: '68,420.50', change: '-1.18%', tone: 'down' },
    { symbol: 'RELIANCE', price: '2,947.30', change: '+0.21%', tone: 'up' }
];

const prices = Array.from({ length: 72 }, (_, index) => {
    const base = 100 + Math.sin(index / 4) * 6 + index * 0.18;
    return base + (Math.random() - 0.45) * 4;
});

function renderSignals() {
    const signalList = document.querySelector('#signalList');
    signalList.innerHTML = signals.map(signal => `
        <div class="signal-card">
            <div>
                <strong>${signal.symbol} <span class="${signal.tone}">${signal.side}</span></strong>
                <small>${signal.setup}</small>
            </div>
            <span class="confidence">${signal.confidence}%</span>
        </div>
    `).join('');
}

function renderWatchlist() {
    const watchlistElement = document.querySelector('#watchlist');
    watchlistElement.innerHTML = watchlist.map(item => `
        <div class="watch-row">
            <div>
                <strong>${item.symbol}</strong>
                <span>${item.price}</span>
            </div>
            <strong class="${item.tone}">${item.change}</strong>
        </div>
    `).join('');
}

function drawChart() {
    const { width, height } = chart;
    ctx.clearRect(0, 0, width, height);

    const padding = 34;
    const min = Math.min(...prices) - 4;
    const max = Math.max(...prices) + 4;
    const xStep = (width - padding * 2) / (prices.length - 1);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.11)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i += 1) {
        const y = padding + i * ((height - padding * 2) / 5);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

    ctx.beginPath();
    prices.forEach((price, index) => {
        const x = padding + index * xStep;
        const y = height - padding - ((price - min) / (max - min)) * (height - padding * 2);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    prices.forEach((price, index) => {
        const x = padding + index * xStep;
        const y = height - padding - ((price - min) / (max - min)) * (height - padding * 2);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    const latest = prices.at(-1);
    const latestY = height - padding - ((latest - min) / (max - min)) * (height - padding * 2);
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(width - padding, latestY, 6, 0, Math.PI * 2);
    ctx.fill();
}

function calculatePositionSize() {
    const capital = Number(capitalInput.value) || 0;
    const riskPercent = Number(riskInput.value) || 0;
    const stopLoss = Number(stopInput.value) || 1;
    const riskAmount = capital * (riskPercent / 100);
    const quantity = Math.max(1, Math.floor(riskAmount / stopLoss));
    positionSizeOutput.textContent = quantity.toLocaleString('en-IN');
}

function tickMarket() {
    const last = prices.at(-1);
    prices.push(last + (Math.random() - 0.46) * 2.4);
    prices.shift();
    drawChart();
}

[capitalInput, riskInput, stopInput].forEach(input => {
    input.addEventListener('input', calculatePositionSize);
});

renderSignals();
renderWatchlist();
calculatePositionSize();
drawChart();
setInterval(tickMarket, 1800);
