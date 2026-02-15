// gestures.js - Handles touch gestures, animations, and UI updates
class GestureManager {
    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.threshold = 50;
        this.container = document.getElementById('button-container');
        this.currentBtn = null;
        this.animating = false;

        this.init();
        this.renderCurrentButton();
    }

    init() {
        const view = document.getElementById('view');
        view.addEventListener('touchstart', (e) => this.handleStart(e), { passive: true });
        view.addEventListener('touchend', (e) => this.handleEnd(e), { passive: true });

        document.getElementById('out-btn').onclick = () => {
            alert('Out!'); // Placeholder - could be window.close() or navigation
        };

        window.addEventListener('beforeunload', () => {
            grid.saveCurrentIndex();
        });
    }

    handleStart(e) {
        if (this.animating) return;
        const touch = e.touches[0];
        this.startX = touch.clientX;
        this.startY = touch.clientY;
    }

    handleEnd(e) {
        if (this.animating || !e.changedTouches.length) return;
        const touch = e.changedTouches[0];
        const dx = touch.clientX - this.startX;
        const dy = touch.clientY - this.startY;

        let direction = null;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > this.threshold) {
            direction = dx > 0 ? 'right' : 'left';
        } else if (Math.abs(dy) > this.threshold) {
            direction = dy > 0 ? 'down' : 'up';
        }

        if (direction) {
            this.handleSwipe(direction);
        }
    }

    handleSwipe(direction) {
        const nextIndex = grid.getNextIndex(direction);
        if (nextIndex === null) {
            // Invalid move, show arrows
            const possible = grid.getPossibleDirections();
            grid.showArrows(possible);
            return;
        }

        this.animateTransition(direction, nextIndex);
    }

    animateTransition(direction, nextIndex) {
        this.animating = true;
        const currentBtn = this.currentBtn.cloneNode(true); // Clone for outgoing
        const incomingBtn = grid.createButton(nextIndex);

        // Position incoming based on direction
        let incomingTransform = '';
        let outgoingTransform = '';
        switch (direction) {
            case 'left': // Swipe left: out left, in from right
                outgoingTransform = 'translateX(-100%)';
                incomingTransform = 'translateX(100%)';
                break;
            case 'right': // Swipe right: out right, in from left
                outgoingTransform = 'translateX(100%)';
                incomingTransform = 'translateX(-100%)';
                break;
            case 'up': // Swipe up: out up, in from bottom
                outgoingTransform = 'translateY(-100%)';
                incomingTransform = 'translateY(100%)';
                break;
            case 'down': // Swipe down: out down, in from top
                outgoingTransform = 'translateY(100%)';
                incomingTransform = 'translateY(-100%)';
                break;
        }

        currentBtn.style.transform = outgoingTransform;
        incomingBtn.style.transform = incomingTransform;
        incomingBtn.style.position = 'absolute';
        incomingBtn.style.top = '0';
        incomingBtn.style.left = '0';
        incomingBtn.style.width = '100%';
        incomingBtn.style.height = '100%';

        this.container.appendChild(incomingBtn);
        this.container.appendChild(currentBtn); // Append clone after to layer correctly? But since absolute, order may not matter

        // Trigger transition
        requestAnimationFrame(() => {
            currentBtn.style.transform = outgoingTransform;
            incomingBtn.style.transform = 'translate(0, 0)';
        });

        // After transition
        setTimeout(() => {
            this.container.innerHTML = '';
            this.currentBtn = incomingBtn;
            this.container.appendChild(incomingBtn);
            grid.moveTo(nextIndex);
            this.renderCurrentButton(); // Not needed, since we set it
            this.animating = false;
        }, 300);
    }

    renderCurrentButton() {
        if (this.currentBtn) {
            this.container.removeChild(this.currentBtn);
        }
        this.currentBtn = grid.createButton(grid.currentIndex);
        this.container.appendChild(this.currentBtn);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new GestureManager();
});