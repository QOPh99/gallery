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
        const out = this.container.firstElementChild.cloneNode(true);
        const inBtn = grid.create(nextIdx);

        // Force explicit starting styles on BOTH elements
        const baseStyles = {
            position: 'absolute',
            inset: '0',
            margin: '0',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease-out'
        };

        Object.assign(out.style, baseStyles);
        Object.assign(inBtn.style, baseStyles);

        // Set explicit starting transform for incoming (this is the key fix)
        inBtn.style.transform = this.enter(dir);

        // Hide original, add animated clones
        this.container.firstElementChild.style.display = 'none';
        this.container.append(out, inBtn);

        // Force reflow + start animation
        void inBtn.offsetWidth;  // ← important: forces browser to apply initial transform before changing it

        requestAnimationFrame(() => {
            out.style.transform  = this.exit(dir);
            inBtn.style.transform = 'translate(0,0)';
        });

        setTimeout(() => {
            this.container.innerHTML = '';
            this.container.append(inBtn);
            grid.move(nextIdx);
            this.anim = false;
        }, 320);
    }
        exit(dir) {
        return {
            left:  'translateX(100%)',   // swipe left → current flies LEFT out
            right: 'translateX(-100%)',    // swipe right → current flies RIGHT out
            up:    'translateY(-100%)',
            down:  'translateY(100%)'
        }[dir];
    }

    enter(dir) {
        return {
            left:  'translateX(-100%)',    // when swiping left → new comes FROM RIGHT
            right: 'translateX(100%)',   // when swiping right → new comes FROM LEFT
            up:    'translateY(100%)',    // swipe up → new from bottom
            down:  'translateY(-100%)'    // swipe down → new from top
        }[dir];
    }
        render() {
        this.container.innerHTML = '';
        const btn = grid.create(grid.current);
        
        // Force correct initial styles + pretend it's "already entered from correct side"
        ['position','inset','margin','width','height','display','align-items','justify-content','transform']
            .forEach((prop, i) => {
                const vals = ['absolute','0','0','100%','100%','flex','center','center','translate(0,0)'];
                btn.style[prop] = vals[i];
            });

        this.container.append(btn);
    }
}
document.addEventListener('DOMContentLoaded', () => new Gestures());