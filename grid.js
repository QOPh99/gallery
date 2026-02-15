// grid.js - Manages grid positions, indices, storage, and arrow logic
class GridManager {
    constructor() {
        this.cols = 4;
        this.currentIndex = this.loadCurrentIndex() || 1;
        this.arrowsTimeout = null;
    }

    getRow(index) {
        return Math.floor((index - 1) / this.cols);
    }

    getCol(index) {
        return (index - 1) % this.cols;
    }

    getNextIndex(direction) {
        const row = this.getRow(this.currentIndex);
        const col = this.getCol(this.currentIndex);
        let newIndex = this.currentIndex;

        switch (direction) {
            case 'left':
                if (col > 0) newIndex--;
                else return null;
                break;
            case 'right':
                newIndex++;           // always possible → infinite right
                break;
            case 'up':
                newIndex += this.cols; // always possible → infinite up
                break;
            case 'down':
                if (row > 0) newIndex -= this.cols;
                else return null;
                break;
            default:
                return null;
        }

        return newIndex > 0 ? newIndex : null;
    }

    moveTo(index) {
        if (index && index !== this.currentIndex) {
            this.currentIndex = index;
            this.saveCurrentIndex();
        }
    }

    createButton(index) {
        const btn = document.createElement('div');
        btn.className = `grid-btn btn-${index}`;
        btn.textContent = index;
        btn.onclick = () => console.log(`Clicked button ${index}`);
        return btn;
    }

    showArrows(possibleDirections) {
        const arrows = document.getElementById('arrows');
        arrows.classList.remove('show');
        clearTimeout(this.arrowsTimeout);

        document.querySelectorAll('.arrow').forEach(a => a.style.display = 'none');

        possibleDirections.forEach(dir => {
            const el = document.querySelector(`.arrow.${dir}`);
            if (el) el.style.display = 'flex';
        });

        arrows.classList.add('show');
        this.arrowsTimeout = setTimeout(() => arrows.classList.remove('show'), 1000);
    }

    getPossibleDirections() {
        const row = this.getRow(this.currentIndex);
        const col = this.getCol(this.currentIndex);
        const dirs = ['right', 'up']; // always possible

        if (col > 0) dirs.push('left');
        if (row > 0) dirs.push('down');

        return dirs;
    }

    loadCurrentIndex() {
        return parseInt(localStorage.getItem('currentButtonIndex'), 10) || 1;
    }

    saveCurrentIndex() {
        localStorage.setItem('currentButtonIndex', this.currentIndex);
    }
}

const grid = new GridManager();