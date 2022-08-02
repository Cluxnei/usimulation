class Universe {
    constructor(size, chunkController) {
        this.size = size;
        this.chunkController = chunkController;
    }

    getState() {
        return {
            text: 'Hello World',
        };
    }

    update(deltaTime) {

    }
}

export class FiniteUniverse extends Universe {
    constructor(size, chunkController) {
        super(size, chunkController);
    }
}