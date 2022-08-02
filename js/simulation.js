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


}