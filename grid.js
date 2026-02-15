// grid.js - Minimal grid logic
const grid = {
    cols: 4,
    current: 1,
    getRow: idx => Math.floor((idx - 1) / grid.cols),
    getCol: idx => (idx - 1) % grid.cols,
    next(dir) {
        let idx = grid.current;
        const row = this.getRow(idx), col = this.getCol(idx);
        switch (dir) {
            case 'left': return col > 0 ? --idx : null;
            case 'right': return col < 3 ? ++idx : null;
            case 'up': return idx + this.cols;
            case 'down': return idx > this.cols ? idx - this.cols : null;
        }
        return null;
    },
    move(idx) { if (idx && idx !== grid.current) grid.current = idx; },
    create(idx) {
        const btn = document.createElement('div');
        btn.className = `grid-btn btn-${idx}`;
        btn.textContent = idx;
        btn.onclick = () => console.log(`Clicked ${idx}`);
        return btn;
    },
        possible() {
        const row = this.getRow(grid.current), col = this.getCol(grid.current);
        const dirs = [];
        
        // Flip horizontal hints to match "content follows finger" feel
        if (col > 0) dirs.push('right');   // can go left in grid → show RIGHT arrow (pull from right)
        if (col < 3) dirs.push('left');    // can go right in grid → show LEFT arrow (pull from left)
        
        dirs.push('up');
        if (grid.current > this.cols) dirs.push('down');
        
        return dirs;
    },
    showArrows(dirs) {
        const arrows = document.getElementById('arrows'), els = document.querySelectorAll('.arrow');
        els.forEach(el => el.style.display = 'none');
        dirs.forEach(dir => document.querySelector(`.arrow.${dir}`)?.style.setProperty('display', 'flex'));
        arrows.classList.toggle('show', dirs.length > 0);
        clearTimeout(grid.timeout);
        if (dirs.length) grid.timeout = setTimeout(() => arrows.classList.remove('show'), 1000);
    }
};