class Gestures {
    constructor() {
    this.threshold = 50;
    this.anim = false;
    this.isDragging = false;          // renamed for clarity
    this.sx = 0;
    this.sy = 0;
    this.container = document.getElementById('btn-container');
    this.init();
    
}

updateMiniGrid() {
        const cellsContainer = document.getElementById('mini-cells');
        const rowNumEl = document.getElementById('row-num');
        const colNumEl = document.getElementById('col-num');

        if (!cellsContainer || !rowNumEl || !colNumEl) {
            console.warn('Mini-grid elements not found in DOM');
            return;
        }

        const current = grid.current;
        const cols = grid.cols;                // 4
        const totalButtons = 117;              // ← adjust if different

        const currentRow = grid.getRow(current);  // 0-based
        const currentCol = grid.getCol(current);  // 0-based

        // Decide starting row for the 3-row sliding window
        let startRow = currentRow - 1;
        if (currentRow <= 0)          startRow = 0;
        else if (currentRow >= Math.floor((totalButtons - 1) / cols) - 1) {
            startRow = Math.max(0, Math.floor((totalButtons - 1) / cols) - 2);
        }

        // Rebuild the 3 rows × 4 cols = 12 cells
        cellsContainer.innerHTML = '';

        for (let r = 0; r < 3; r++) {
            const rowIdx = startRow + r;
            for (let c = 0; c < cols; c++) {
                const idx = rowIdx * cols + c + 1;

                const cell = document.createElement('div');
                cell.className = 'mini-cell';

                if (idx <= totalButtons) {
                    cell.textContent = idx;
                    if (idx === current) {
                        cell.classList.add('current');
                    }
                } else {
                    cell.style.visibility = 'hidden';
                }

                cellsContainer.appendChild(cell);
            }
        }

        rowNumEl.textContent = currentRow + 1;
        colNumEl.textContent = currentCol + 1;
    

    // Clear and rebuild cells (we rebuild because window moves)
    container.innerHTML = '';

    for (let r = 0; r < 3; r++) {
        const rowIdx = startRow + r;
        for (let c = 0; c < cols; c++) {
            const idx = rowIdx * cols + c + 1;

            const cell = document.createElement('div');
            cell.className = 'mini-cell';

            // Only show number if button actually exists
            if (idx <= totalButtons) {
                cell.textContent = idx;
                if (idx === current) {
                    cell.classList.add('current');
                }
            } else {
                cell.style.visibility = 'hidden'; // or opacity:0
            }

            container.appendChild(cell);
        }
    }

    // Update label
    const col = grid.getCol(current) + 1;
    const row = currentRow + 1;
    document.getElementById('row-num').textContent = row;
    document.getElementById('col-num').textContent = col;
}

init() {
    const view = document.getElementById('view');

    // Touch – unchanged
    view.addEventListener('touchstart', e => {
        if (!this.anim && e.touches?.[0]) {
            this.sx = e.touches[0].clientX;
            this.sy = e.touches[0].clientY;
            this.isDragging = true;
        }
    }, { passive: true });

    view.addEventListener('touchend', e => {
        if (this.anim || !this.isDragging) return;
        this.isDragging = false;

        const touch = e.changedTouches?.[0];
        if (!touch) return;

        const dx = touch.clientX - this.sx;
        const dy = touch.clientY - this.sy;
        let dir;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > this.threshold)
            dir = dx > 0 ? 'left' : 'right';
        else if (Math.abs(dy) > this.threshold)
            dir = dy > 0 ? 'down' : 'up';

        if (dir) this.swipe(dir);
    }, { passive: true });

    // ── Mouse – more robust version ──
    view.addEventListener('mousedown', e => {
        if (this.anim) return;
        e.preventDefault();           // prevents text selection / other defaults
        this.sx = e.clientX;
        this.sy = e.clientY;
        this.isDragging = true;
    });

    // Track mouseup anywhere on document (not just inside view)
    document.addEventListener('mouseup', e => {
        if (!this.isDragging || this.anim) return;
        this.isDragging = false;

        const dx = e.clientX - this.sx;
        const dy = e.clientY - this.sy;
        let dir;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > this.threshold)
            dir = dx > 0 ? 'left' : 'right';
        else if (Math.abs(dy) > this.threshold)
            dir = dy > 0 ? 'down' : 'up';

        if (dir) this.swipe(dir);
    });

    // Also cancel if mouse leaves window or view
    view.addEventListener('mouseleave', () => {
        this.isDragging = false;
    });

    window.addEventListener('blur', () => {
        this.isDragging = false;      // tab switch / alt-tab
    });

    
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
            this.updateMiniGrid();
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
            this.container.appendChild(btn);
            this.updateMiniGrid();
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