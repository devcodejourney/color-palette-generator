class PaletteGenerator {
    constructor() {
        this.colors = [];
        this.lockedColors = new Set();
        this.container = document.getElementById('paletteContainer');
        this.generateBtn = document.getElementById('generateBtn');
        this.toast = document.getElementById('toast');

        this.init();
    }

    init() {
        this.generateBtn.addEventListener('click', () => this.generatePalette());
        this.generatePalette();
    }

    generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    generatePalette() {
        this.colors = [];

        for (let i = 0; i < 5; i++) {
            if (this.lockedColors.has(i)) {
                this.colors.push(this.container.children[i].dataset.color);
            } else {
                this.colors.push(this.generateRandomColor());
            }
        }

        this.render();
    }

    render() {
        this.container.innerHTML = '';

        this.colors.forEach((color, index) => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color;
            colorBox.dataset.color = color;

            const isLocked = this.lockedColors.has(index);

            colorBox.innerHTML = `
    <div class="color-value">${color}</div>
    <div class="lock-icon ${isLocked ? 'locked' : ''}" data-index="${index}">
        ${isLocked ?
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>' :
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'
                }
    </div>
    `;

            // Copy color on click
            colorBox.addEventListener('click', (e) => {
                if (!e.target.closest('.lock-icon')) {
                    this.copyToClipboard(color);
                }
            });

            // Toggle lock
            const lockIcon = colorBox.querySelector('.lock-icon');
            lockIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLock(index);
            });

            this.container.appendChild(colorBox);
        });
    }

    toggleLock(index) {
        if (this.lockedColors.has(index)) {
            this.lockedColors.delete(index);
        } else {
            this.lockedColors.add(index);
        }
        this.render();
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast(`Copied ${text} to clipboard!`);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast(`Copied ${text} to clipboard!`);
        }
    }

    showToast(message) {
        this.toast.textContent = message;
        this.toast.classList.add('show');

        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 2000);
    }
}

// Initialize the app
const paletteGenerator = new PaletteGenerator();
