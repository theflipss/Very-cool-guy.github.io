const colors = ['#8B1A00', '#C0C0C0', '#2E7D32'];
const shapes = ['square', 'circle'];
const below = document.getElementById('confetti-below');
const above = document.getElementById('confetti-above');
for (let i = 0; i < 60; i++) {
  const el = document.createElement('div');
  el.className = 'confetti';
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = 6 + Math.random() * 8;
  const isCircle = shapes[Math.floor(Math.random() * shapes.length)] === 'circle';
  el.style.cssText = `
    left: ${Math.random() * 100}%;
    width: ${size}px;
    height: ${isCircle ? size : size * 0.5}px;
    background: ${color};
    border-radius: ${isCircle ? '50%' : '2px'};
    animation: fall ${4 + Math.random() * 5}s linear ${Math.random() * 5}s infinite, sway ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite;
  `;
  (Math.random() < 0.5 ? below : above).appendChild(el);
}