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
        let newIndex;

        switch (direction) {
            case 'left':
                if (col > 0) {
                    newIndex = this.currentIndex - 1;
                } else {
                    return null; // Invalid
                }
                break;
            case 'right':
                newIndex = this.currentIndex + 1;
                break;
            case 'up':
                newIndex = this.currentIndex + this.cols;
                break;
            case 'down':
                if (row > 0) {
                    newIndex = this.currentIndex - this.cols;
                } else {
                    return null; // Invalid
                }
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
        btn.onclick = () => console.log(`Clicked button ${index}`); // Placeholder for button action
        return btn;
    }

    showArrows(possibleDirections) {
        const arrows = document.getElementById('arrows');
        arrows.classList.remove('show');
        clearTimeout(this.arrowsTimeout);

        // Hide all arrows first
        document.querySelectorAll('.arrow').forEach(arrow => {
            arrow.style.display = 'none';
        });

        // Show possible
        possibleDirections.forEach(dir => {
            const arrow = document.querySelector(`.arrow.${dir}`);
            if (arrow) {
                arrow.style.display = 'flex';
            }
        });

        arrows.classList.add('show');
        this.arrowsTimeout = setTimeout(() => {
            arrows.classList.remove('show');
        }, 1000);
    }

    getPossibleDirections() {
        const row = this.getRow(this.currentIndex);
        const col = this.getCol(this.currentIndex);
        const dirs = [];

        if (col > 0) dirs.push('left');
        dirs.push('right'); // Always possible
        if (row > 0) dirs.push('down');
        dirs.push('up'); // Always possible

        return dirs;
    }

    loadCurrentIndex() {
        return parseInt(localStorage.getItem('currentButtonIndex')) || 1;
    }

    saveCurrentIndex() {
        localStorage.setItem('currentButtonIndex', this.currentIndex);
    }
}

// Global instance
const grid = new GridManager();