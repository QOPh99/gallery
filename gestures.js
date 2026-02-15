// gestures.js - Handles touch gestures, animations, and UI updates
class GestureManager {
    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.threshold = 60;           // slightly higher → feels more intentional
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
            alert('Out!'); // or history.back(), window.close(), etc.
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
        if (this.animating || !e.changedTouches?.length) return;
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
            // Blocked direction → show hint arrows
            const possible = grid.getPossibleDirections();
            grid.showArrows(possible);
            return;
        }

        this.animateTransition(direction, nextIndex);
    }

    animateTransition(direction, nextIndex) {
        this.animating = true;

        // Create clone of current for outgoing animation
        const outgoing = this.currentBtn.cloneNode(true);
        outgoing.style.position = 'absolute';
        outgoing.style.inset = '0';
        outgoing.style.margin = '0';
        outgoing.style.width = '100%';
        outgoing.style.height = '100%';
        outgoing.style.transition = 'transform 0.24s ease-out';

        // Create incoming button
        const incoming = grid.createButton(nextIndex);
        incoming.style.position = 'absolute';
        incoming.style.inset = '0';
        incoming.style.margin = '0';
        incoming.style.width = '100%';
        incoming.style.height = '100%';
        incoming.style.transition = 'transform 0.24s ease-out';
        incoming.style.transform = this.getEnterTransform(direction);

        // Add both to container
        this.container.appendChild(outgoing);
        this.container.appendChild(incoming);

        // Hide original current (we use clone for animation)
        this.currentBtn.style.display = 'none';

        // Trigger animation
        requestAnimationFrame(() => {
            outgoing.style.transform = this.getExitTransform(direction);
            incoming.style.transform = 'translate(0, 0)';
        });

        // Clean up after animation
        setTimeout(() => {
            this.container.innerHTML = '';           // remove both animated clones
            this.currentBtn = incoming;              // promote incoming to current
            this.currentBtn.style.display = 'flex';  // in case we hid something
            this.container.appendChild(this.currentBtn);
            grid.moveTo(nextIndex);
            this.animating = false;
        }, 280);
    }

    getExitTransform(dir) {
        switch (dir) {
            case 'left':   return 'translateX(-120%)';
            case 'right':  return 'translateX(120%)';
            case 'up':     return 'translateY(-120%)';
            case 'down':   return 'translateY(120%)';
        }
    }

    getEnterTransform(dir) {
        switch (dir) {
            case 'left':   return 'translateX(120%)';   // comes from right
            case 'right':  return 'translateX(-120%)';  // comes from left
            case 'up':     return 'translateY(120%)';   // comes from bottom
            case 'down':   return 'translateY(-120%)';  // comes from top
        }
    }

    renderCurrentButton() {
        this.container.innerHTML = '';
        this.currentBtn = grid.createButton(grid.currentIndex);
        this.container.appendChild(this.currentBtn);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new GestureManager();
});