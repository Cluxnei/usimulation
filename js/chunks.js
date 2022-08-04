import {CHUNKS_COUNT} from './constants.js';
import {Vector2} from './vectors.js';
import {newtonGravitationLaw} from './helpers.js';

class Chunk {

    constructor(_index, chunkSize, position) {
        this._index = _index;
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

    computeCenterOfMass() {
        const {position, mass} = this.getCenterOfMass();
        this.centerOfMassPosition = position;
        this.centerOfMassMass = mass;
        return {position, mass};
    }

    // (m1 * x1 + m2 * x2 + ...) / (m1 + m2 + ...) = center of mass position X
    getCenterOfMass() {
        if (this.planets.length === 0) {
            return {
                position: this.position.copy().add(this.chunkSize.copy().scale(0.5)),
                mass: 0,
            };
        }
        if (this.planets.length === 1) {
            return {
                position: this.planets[0].position.copy(),
                mass: this.planets[0].mass,
            };
        }
        const accumulatedMassPositionX = this.planets.reduce((acc, p) => acc + p.mass * p.position.x, 0);
        const accumulatedMassPositionY = this.planets.reduce((acc, p) => acc + p.mass * p.position.y, 0);
        const accumulatedMass = this.planets.reduce((acc, p) => acc + p.mass, 0);

        const position = new Vector2(
            accumulatedMassPositionX / accumulatedMass,
            accumulatedMassPositionY / accumulatedMass
        );
        return {
            position,
            mass: accumulatedMass,
        }
    }

    updatePlanetsPosition(deltaTime) {
        const limits = this.manager.universe.getLimitEdges();
        this.planets.forEach(planet => {
            planet.updatePosition(deltaTime, limits);
        });
    }

    hasPlanetsOutsideLimits() {
        return this.planets.some(planet => {
            const chunkLimits = this.getLimits();
            return planet.isPositionOutsideChunkLimits(null, chunkLimits);
        });
    }

    setManager(manager) {
        this.manager = manager;
    }

    computeInternalForces() {
        this.planets.forEach(planet => {
            planet.forces = this.planets.reduce((acc, p) => acc.add(planet.attractionTo(p)), new Vector2());
        });
    }

    computeOuterForces() {
        const force = this.manager.chunks.reduce((acc, chunk) => acc.add(this.attractionTo(chunk)), new Vector2());
        this.planets.forEach(planet => {
            planet.forces.add(force);
        });
    }

    attractionTo(otherChunk) {
        if (otherChunk === this || !otherChunk.centerOfMassPosition || !this.centerOfMassPosition) {
            return new Vector2();
        }
        const distanceBetweenChunksCenterOfMass = otherChunk.centerOfMassPosition.copy().sub(this.centerOfMassPosition);
        const distanceBetweenChunksCenterOfMassScalar = distanceBetweenChunksCenterOfMass.magnitude();
        const forceScalar = newtonGravitationLaw(
            this.centerOfMassMass,
            otherChunk.centerOfMassMass,
            distanceBetweenChunksCenterOfMassScalar
        );
        return distanceBetweenChunksCenterOfMass.normalize().scale(forceScalar);
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
        let _index = 0;
        for (let i = 0; i < chunksOnAxis; i++) {
            for (let j = 0; j < chunksOnAxis; j++) {
                const chunkPosition = new Vector2(
                    universeLimits.left + i * chunkSize.x,
                    universeLimits.top + j * chunkSize.y
                );
                const chunk = new Chunk(_index, chunkSize, chunkPosition);
                chunk.setManager(this);
                this.chunks.push(chunk);
                _index++;
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
        this.currentHighlightedChunk = chunk;
    }

    generatePlanets() {
        for (let i = 0; i < this.planetsCount; i++) {
            this.planets.push(this.planetGenerator.generatePlanet());
        }
    }

    associatePlanetsWithChunks() {
        this.chunks.forEach(chunk => {
            chunk.planets = [];
        });
        this.planets.forEach(planet => {
            const chunk = this.getChunkAt(planet.position);
            chunk.planets.push(planet);
        });
    }

    computeCenterOfMass() {
        this.chunks.forEach(chunk => {
            chunk.computeCenterOfMass()
        });
    }

    update(deltaTime) {
        this.updateChunks(deltaTime);
        this.computeCenterOfMass(); // maybe only when call associatePlanetsWithChunks() for better performance
    }

    updateChunks(deltaTime) {
        this.chunks.forEach(chunk => {
            chunk.computeInternalForces();
            chunk.computeOuterForces();
            chunk.updatePlanetsPosition(deltaTime);
        });
        if (this.chunks.some(chunk => chunk.hasPlanetsOutsideLimits())) {
            this.associatePlanetsWithChunks();
        }
    }
}