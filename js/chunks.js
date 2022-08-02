import {CHUNKS_COUNT} from './constants.js';
import {Vector2} from './vectors.js';

class Chunk {

    constructor(chunkSize, position) {
        this.chunkSize = chunkSize;
        this.position = position;
        this.planets = [];
    }

    getLimits() {
        return {
            top: this.position.y + this.chunkSize.y,
            bottom: this.position.y,
            left: this.position.x,
            right: this.position.x + this.chunkSize.x,
        }
    }


}

export class ChunkController {

    constructor(planetGenerator, planetsCount) {
        this.chunks = [];
        this.planets = [];
        this.planetGenerator = planetGenerator;
        this.planetsCount = planetsCount;
    }

    getChunksLimits() {
        return this.chunks.map(chunk => chunk.getLimits());
    }

    setUniverse(universe) {
        this.universe = universe;
    }

    generateChunks() {
        const universeLimits = this.universe.getLimitEdges();
        const chunksOnAxis = Math.ceil(Math.sqrt(CHUNKS_COUNT));
        const chunkSize = new Vector2(
            (universeLimits.right - universeLimits.left) / chunksOnAxis,
            (universeLimits.bottom - universeLimits.top) / chunksOnAxis
        );
        for (let i = 0; i < chunksOnAxis; i++) {
            for (let j = 0; j < chunksOnAxis; j++) {
                const chunkPosition = new Vector2(
                    universeLimits.left + i * chunkSize.x,
                    universeLimits.top + j * chunkSize.y
                );
                this.chunks.push(new Chunk(chunkSize, chunkPosition));
            }
        }
    }

    getChunkAt(position) {
        const chunkIndex = this.getChunkIndexAt(position);
        return this.chunks[chunkIndex];
    }

    getChunkIndexAt(position) {
        return this.chunks.findIndex(chunk => (
            position.x >= chunk.position.x &&
            position.x < chunk.position.x + chunk.chunkSize.x &&
            position.y < chunk.position.y &&
            position.y >= chunk.position.y + chunk.chunkSize.y
        ));
    }

    highlightChunk(chunk) {
        this.highlightedChunkLimits = chunk ? chunk.getLimits() : null;
    }

    generatePlanets() {
        for (let i = 0; i < this.planetsCount; i++) {
            this.planets.push(this.planetGenerator.generatePlanet());
        }
    }

    associatePlanetsWithChunks() {
        this.planets.forEach(planet => {
            const chunk = this.getChunkAt(planet.position);
            chunk.planets.push(planet);
        });
    }
}