export function fireConfetti(count = 80) {
  const colors = ['#FF6A3D', '#25D366', '#3B82F6', '#F59E0B', '#8B5CF6'];
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
  document.body.appendChild(container);
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const size = 6 + Math.random() * 6;
    const left = 40 + Math.random() * 20;
    const dx = (Math.random() - 0.5) * 600;
    const dy = -300 - Math.random() * 200;
    const rot = Math.random() * 720 - 360;
    el.style.cssText = `position:absolute;left:${left}%;top:55%;width:${size}px;height:${size * 0.6}px;background:${colors[i % colors.length]};border-radius:1px;opacity:0;`;
    container.appendChild(el);
    el.animate([
      { transform: 'translate(0,0) rotate(0)', opacity: 1 },
      { transform: `translate(${dx}px,${dy}px) rotate(${rot}deg)`, opacity: 1, offset: 0.4 },
      { transform: `translate(${dx * 1.3}px,400px) rotate(${rot * 1.5}deg)`, opacity: 0 },
    ], { duration: 1600 + Math.random() * 600, easing: 'cubic-bezier(.2,.6,.4,1)' });
  }
  setTimeout(() => container.remove(), 2400);
}
