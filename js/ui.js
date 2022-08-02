export class Ui {
    constructor(simulation, canvas, ctx) {
        this.simulation = simulation;
        this.canvas = canvas;
        this.ctx = ctx;
        this.element = document.getElementById('ui');
        this.canvas.addEventListener('click', () => {
            this.handleClick();
        });
    }

    update() {
        this.simulationBufferFillPercentage = this.simulation.getBufferFillPercentage();
        this.simulationChunks = this.simulation.universe.chunkController.chunks.length;
        this.canvasZoom = this.canvas.zoom;
    }

    render() {
        this.element.innerHTML = this.buildHtml();
    }

    buildHtml() {
        return `
            Buffer: ${this.percentage(this.simulationBufferFillPercentage)}%<br>
            Chunks: ${this.simulationChunks}<br>
            Zoom: ${this.canvasZoom}<br>
        `;
    }

    percentage(percentage) {
        return percentage < 100 ? `0${percentage}` : percentage;
    }

    handleClick() {
        this.highlightChunk(this.canvas.mousePositionInCanvas);
    }

    highlightChunk(position) {
        this.simulation.highlightChunkAt(position);
    }
}