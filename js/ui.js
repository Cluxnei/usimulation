
export class Ui {
    constructor(simulation, canvas, ctx) {
        this.simulation = simulation;
        this.canvas = canvas;
        this.ctx = ctx;
        this.element = document.getElementById('ui');
        this.lastClickTime = Date.now();
        this.canvas.addEventListener('click', () => {
            this.handleClick();
        });
    }

    update() {
        this.simulationBufferFillPercentage = this.simulation.getBufferFillPercentage();
        this.simulationChunks = this.simulation.universe.chunkController.chunks.length;
        this.canvasZoom = this.fixed(this.canvas.zoom);
        this.mousePosition = this.canvas.mousePositionInCanvas;
        this.mousePosition.x = this.fixed(this.mousePosition.x);
        this.mousePosition.y = this.fixed(this.mousePosition.y);
    }

    render() {
        this.element.innerHTML = this.buildHtml();
    }

    buildHtml() {
        return `
            Buffer: ${this.percentage(this.simulationBufferFillPercentage)}%<br>
            Chunks: ${this.simulationChunks}<br>
            Zoom: ${this.canvasZoom}<br>
            Mouse: [${this.mousePosition.x}, ${this.mousePosition.y}]<br>
        `;
    }

    percentage(percentage) {
        return percentage < 100 ? `0${percentage}` : percentage;
    }

    fixed(number) {
        return typeof number === 'number' ? number.toFixed(2) : '-';
    }

    handleClick() {
        const now = Date.now();
        if (now - this.lastClickTime < 200) {
            this.zoomIn();
        }
        this.highlightChunk(this.canvas.mousePositionInCanvas);
        this.lastClickTime = Date.now();
    }

    highlightChunk(position) {
        this.simulation.highlightChunkAt(position);
    }

    zoomIn() {
        this.canvas.dispatchEvent(new WheelEvent('wheel', {deltaY: -300}));
    }
}