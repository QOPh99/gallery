class Gestures {
    constructor() {
        this.threshold = 50;
        this.anim = false;
        this.container = document.getElementById('btn-container');
        this.init();
    }

    init() {
        const view = document.getElementById('view');
        view.addEventListener('touchstart', e => {
            if (!this.anim && e.touches?.[0]) {
                this.sx = e.touches[0].clientX;
                this.sy = e.touches[0].clientY;
            }
        }, { passive: true });

        view.addEventListener('touchend', e => {
            if (this.anim || !e.changedTouches?.length) return;
            const dx = e.changedTouches[0].clientX - this.sx;
            const dy = e.changedTouches[0].clientY - this.sy;
            let dir;

            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > this.threshold) {
                dir = dx > 0 ? 'left' : 'right';
            } else if (Math.abs(dy) > this.threshold) {
                dir = dy > 0 ? 'down' : 'up';
            }

            if (dir) this.swipe(dir);
        }, { passive: true });

        
        this.render();
    }

    swipe(dir) {
        const nextIdx = grid.next(dir);
        if (!nextIdx) return;
        this.animate(dir, nextIdx);
    }

    animate(dir, nextIdx) {
        this.anim = true;
        const out = this.container.firstElementChild?.cloneNode(true);
        if (!out) return;

        const inBtn = grid.create(nextIdx);

        const base = {
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

        Object.assign(out.style, base);
        Object.assign(inBtn.style, base);

        inBtn.style.transform = this.enter(dir);

        this.container.firstElementChild.style.display = 'none';
        this.container.append(out, inBtn);

        void inBtn.offsetWidth;

        requestAnimationFrame(() => {
            out.style.transform = this.exit(dir);
            inBtn.style.transform = 'translate(0,0)';
        });

        setTimeout(() => {
            this.container.innerHTML = '';
            while (this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }

            this.container.appendChild(inBtn);
            grid.move(nextIdx);
            this.anim = false;
        }, 340);
    }

    exit(dir) {
        return {
            left:  'translateX(100%)',
            right: 'translateX(-100%)',
            up:    'translateY(-100%)',
            down:  'translateY(100%)'
        }[dir];
    }

    enter(dir) {
        return {
            left:  'translateX(-100%)',
            right: 'translateX(100%)',
            up:    'translateY(100%)',
            down:  'translateY(-100%)'
        }[dir];
    }

    render() {
        this.container.innerHTML = '';
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }

        const btn = grid.create(grid.current);

        ['position','inset','margin','width','height','display','align-items','justify-content','transform']
            .forEach((p, i) => {
                const v = ['absolute','0','0','100%','100%','flex','center','center','translate(0,0)'];
                btn.style[p] = v[i];
            });

        this.container.appendChild(btn);
    }
}

document.addEventListener('DOMContentLoaded', () => new Gestures());