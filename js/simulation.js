export class Simulation {
    constructor(universe, bufferSize) {
        this.universe = universe;
        this.bufferSize = bufferSize;
        this.buffer = [];
    }

    shiftBuffer() {
        return this.buffer.shift();
    }

    getBufferFillPercentage() {
        return this.buffer.length / this.bufferSize * 100;
    }

    canBeRendered() {
        return this.buffer.length >= 1;
    }

    highlightChunkAt(position) {
        const chunk = this.universe.chunkController.getChunkAt(position);
        this.universe.chunkController.highlightChunk(chunk);
    }

    // update section

    update(deltaTime) {
        const statesToCompute = this.bufferSize - this.buffer.length;
        for (let i = 0; i < statesToCompute; i++) {
            this.buffer.push(this.computeState(deltaTime));
        }
    }

    computeState(deltaTime) {
        const currentState = this.universe.getState();
        this.universe.update(deltaTime);
        return currentState;
    }

    // render section

    render(ctx, clearCallback) {
        if (!this.canBeRendered()) {
            return;
        }
        const state = this.shiftBuffer();
        clearCallback();
        this.renderState(state, ctx);
    }

    renderState(state, ctx) {
        this.renderLimits(state.limits, ctx);
        state.chunksLimits.forEach(limits => {
            this.renderLimits(limits, ctx);
        });
        this.renderHighlights(state.highlights, ctx);
        this.renderPlanets(state.planets, ctx);
        this.renderCentersOfMass(state.chunksCentersOfMass, ctx);
    }

    renderLimits(limits, ctx) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(limits.left, limits.top);
        ctx.lineTo(limits.right, limits.top);
        ctx.lineTo(limits.right, limits.bottom);
        ctx.lineTo(limits.left, limits.bottom);
        ctx.closePath();
        ctx.stroke();
    }


    renderHighlights(highlights, ctx) {
        if (highlights.highlightedChunkLimits) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
            ctx.fillRect(
                highlights.highlightedChunkLimits.left,
                highlights.highlightedChunkLimits.top,
                highlights.highlightedChunkLimits.right - highlights.highlightedChunkLimits.left,
                highlights.highlightedChunkLimits.bottom - highlights.highlightedChunkLimits.top
            );
        }
    }

    renderPlanets(planets, ctx) {
        planets.forEach(planet => {
            ctx.fillStyle = planet.color;
            this.renderArc(planet.position, planet.radius, ctx);
        });
    }

    renderArc(position, radius, ctx) {
        ctx.beginPath();
        ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    renderCentersOfMass(chunksCentersOfMass, ctx) {
        ctx.fillStyle = 'rgba(240,255,0,0.5)';
        chunksCentersOfMass.forEach(centerOfMass => {
            this.renderArc(centerOfMass, 3, ctx);
        });
    }
}