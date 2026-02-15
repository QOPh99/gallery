const grid = {
    cols: 4,
    current: 1,

    getRow(idx) { return Math.floor((idx - 1) / this.cols); },
    getCol(idx) { return (idx - 1) % this.cols; },

    next(dir) {
        let idx = this.current;
        const row = this.getRow(idx);
        const col = this.getCol(idx);

        switch (dir) {
            case 'left':  return col > 0   ? idx - 1 : null;
            case 'right': return col < 3   ? idx + 1 : null;
            case 'up':    return idx + this.cols;
            case 'down':  return idx > this.cols ? idx - this.cols : null;
        }
        return null;
    },

    move(idx) {
        if (idx && idx !== this.current) this.current = idx;
    },

    create(idx) {
    const btn = document.createElement('div');
    btn.className = `grid-btn btn-${idx}`;

    // Create number in top-left
    const numberSpan = document.createElement('span');
    numberSpan.className = 'btn-number';
    numberSpan.textContent = idx;
    btn.appendChild(numberSpan);

    // Optional: add click handler to the whole button
    btn.onclick = () => console.log(`Clicked button ${idx}`);

    return btn;
},

    getBlockedSides() {
        const row = this.getRow(this.current);
        const col = this.getCol(this.current);
        const sides = [];

        if (col === 0) sides.push('left');
        if (col === 3) sides.push('right');
        if (row === 0) sides.push('top');

        return sides;
    }
};