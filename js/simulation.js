export class Simulation {
    constructor(universe, bufferSize) {
        this.universe = universe;
        this.bufferSize = bufferSize;
        this.buffer = [];
    }

    canBeRendered() {
        return this.buffer.length >= 1;
    }

    update(deltaTime) {
        const statesToCompute = this.bufferSize - this.buffer.length;
        for (let i = 0; i < statesToCompute; i++) {
            this.buffer.push(this.computeState(deltaTime));
        }
    }

    render(ctx, clearCallback) {
        if (!this.canBeRendered()) {
            return;
        }
        const state = this.shiftBuffer();
        clearCallback();
        this.renderState(state, ctx);
    }

    getBufferFillPercentage() {
        return this.buffer.length / this.bufferSize * 100;
    }

    renderState(state, ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '30px Arial';
        ctx.fillText(state.text, 10, 10);
    }

    shiftBuffer() {
        return this.buffer.shift();
    }

    computeState(deltaTime) {
        const currentState = this.universe.getState();
        this.universe.update(deltaTime);
        return currentState;
    }
}