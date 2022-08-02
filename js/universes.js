export class Universe {
    constructor(size, chunkController) {
        this.size = size;
        this.chunkController = chunkController;
        this.chunkController.setUniverse(this);
        this.chunkController.generateChunks();
    }

    getState() {
        return {
            text: 'Hello World',
            limits: this.getLimitEdges(),
            chunksLimits: this.chunkController.getChunksLimits(),
            highlights: {
                highlightedChunkLimits: this.chunkController.highlightedChunkLimits || null
            },
        };
    }

    update(deltaTime) {

    }

    getLimitEdges() {
        return {
            top: this.size.y,
            bottom: -this.size.y,
            left: -this.size.x,
            right: this.size.x,
        };
    }
}