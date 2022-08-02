export class Universe {
    constructor(size, chunkController) {
        this.size = size;
        this.chunkController = chunkController;
        this.chunkController.setUniverse(this);
        this.chunkController.generateChunks();
        this.chunkController.generatePlanets();
        this.chunkController.associatePlanetsWithChunks();
    }

    getState() {
        return {
            limits: this.getLimitEdges(),
            chunksLimits: this.chunkController.getChunksLimits(),
            highlights: {
                highlightedChunkLimits: this.chunkController.highlightedChunkLimits || null
            },
            planets: this.chunkController.planets.map(planet => planet.getState()),
            chunksCentersOfMass: this.chunkController.chunks.map(chunk => chunk.centerOfMass).filter(v => v),
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