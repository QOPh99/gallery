// gestures.js - Minimal gesture & animation
class Gestures {
    constructor() {
        this.threshold = 50, this.anim = false, this.container = document.getElementById('btn-container');
        this.init();
    }
    init() {
        const view = document.getElementById('view');
        view.addEventListener('touchstart', e => { if (!this.anim) [this.sx, this.sy] = [e.touches[0].clientX, e.touches[0].clientY]; }, {passive: true});
        view.addEventListener('touchend', e => { if (this.anim || !e.changedTouches.length) return; const [dx, dy] = [e.changedTouches[0].clientX - this.sx, e.changedTouches[0].clientY - this.sy]; let dir; if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > this.threshold) dir = dx > 0 ? 'left' : 'right'; else if (Math.abs(dy) > this.threshold) dir = dy > 0 ? 'down' : 'up'; if (dir) this.swipe(dir); }, {passive: true});
        document.getElementById('out-btn').onclick = () => alert('Out!');
        this.render();
    }
    swipe(dir) {
        const nextIdx = grid.next(dir);
        if (!nextIdx) return grid.showArrows(grid.possible());
        this.animate(dir, nextIdx);
    }
    animate(dir, nextIdx) {
        this.anim = true;
        const out = this.container.firstElementChild.cloneNode(true), inBtn = grid.create(nextIdx);
        ['position', 'inset', 'margin', 'width', 'height', 'display', 'align-items', 'justify-content'].forEach(prop => { out.style[prop] = 'absolute,0,0,100%,100%,flex,center,center'.split(',')[prop === 'position' ? 0 : prop === 'inset' ? 1 : prop === 'margin' ? 2 : prop === 'width' ? 3 : prop === 'height' ? 4 : prop === 'display' ? 5 : prop === 'align-items' ? 6 : 7]; inBtn.style[prop] = out.style[prop]; });
        out.style.transition = 'transform 0.3s ease-out'; inBtn.style.transform = this.enter(dir); this.container.firstElementChild.style.display = 'none'; this.container.append(out, inBtn);
        requestAnimationFrame(() => { out.style.transform = this.exit(dir); inBtn.style.transform = 'translate(0,0)'; });
        setTimeout(() => { this.container.innerHTML = ''; this.container.append(inBtn); grid.move(nextIdx); this.anim = false; }, 300);
    }
    exit(dir) { return {left: 'translateX(-100%)', right: 'translateX(100%)', up: 'translateY(-100%)', down: 'translateY(100%)'}[dir]; }
    enter(dir) { return {left: 'translateX(100%)', right: 'translateX(-100%)', up: 'translateY(100%)', down: 'translateY(-100%)'}[dir]; }
    render() { this.container.innerHTML = ''; const btn = grid.create(grid.current); ['position', 'inset', 'margin', 'width', 'height', 'display', 'align-items', 'justify-content'].forEach(prop => btn.style[prop] = 'absolute,0,0,100%,100%,flex,center,center'.split(',')[prop === 'position' ? 0 : prop === 'inset' ? 1 : prop === 'margin' ? 2 : prop === 'width' ? 3 : prop === 'height' ? 4 : prop === 'display' ? 5 : prop === 'align-items' ? 6 : 7]); this.container.append(btn); }
}
document.addEventListener('DOMContentLoaded', () => new Gestures());