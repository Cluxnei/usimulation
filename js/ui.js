
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
        this.mousePosition = this.canvas.mousePositionInCanvas.copy();
        const chunkController = this.simulation.universe.chunkController;
        const currentHighlightedChunk = chunkController.currentHighlightedChunk;
        this.selectedChunkPlanets = currentHighlightedChunk?.planets?.length;
        this.selectedChunkPlanets = this.selectedChunkPlanets ?? '-';
        this.selectedChunkCenterOfMassPosition = currentHighlightedChunk?.centerOfMassPosition?.copy();
        this.selectedChunkCenterOfMassMass = this.fixed(currentHighlightedChunk?.centerOfMassMass);
        this.selectedChunkIndex = currentHighlightedChunk?._index ?? '';
    }

    vector2ToString(vector) {
        return vector ? `[${this.fixed(vector.x)}, ${this.fixed(vector.y)}]` : '-';
    }

    render() {
        this.element.innerHTML = this.buildHtml();
    }

    buildHtml() {
        return `
            <ul>
                <li>
                    General
                    <ul>
                        <li>Buffer: ${this.simulationBufferFillPercentage}%</li>
                        <li>Chunks: ${this.simulationChunks}</li>
                        <li>Zoom: ${this.canvasZoom}</li>
                        <li>Mouse: ${this.vector2ToString(this.mousePosition)}</li>
                    </ul>
                </li>
                <li>
                    Selected Chunk ${this.selectedChunkIndex}
                    <ul>
                        <li>Planets: ${this.selectedChunkPlanets}</li>   
                        <li>Center of mass: ${this.vector2ToString(this.selectedChunkCenterOfMassPosition)}</li>
                        <li>Center of mass: ${this.selectedChunkCenterOfMassMass}</li>
                    </ul>
                </li>
            </ul>
        `;
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
        this.lastClickTime = now;
    }

    highlightChunk(position) {
        this.simulation.highlightChunkAt(position);
    }

    zoomIn() {
        this.canvas.dispatchEvent(new WheelEvent('wheel', {deltaY: -300}));
    }
}