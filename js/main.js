import {initCanvas, updateCanvas} from './canvas.js';
import {FIXED_DT, SIMULATION_BUFFER_SIZE} from './constants.js';
import {FiniteUniverse} from './universes.js';
import {Vector2} from './vectors.js';
import {ChunkController} from './chunks.js';
import {Simulation} from './simulation.js';
import {Ui} from './ui.js';

const start = () => {
    const canvas = initCanvas();
    const ctx = canvas.getContext('2d');

    const chunkController = new ChunkController();

    const universeSize = new Vector2(canvas.width * 2, canvas.height * 2);
    const universe = new FiniteUniverse(
        universeSize,
        chunkController
    );

    const simulation = new Simulation(universe, SIMULATION_BUFFER_SIZE);

    const ui = new Ui(simulation);

    const deltaTime = FIXED_DT;

    const updateLoop = () => {
        simulation.update(deltaTime);
    };
    const renderLoop = () => {
        simulation.render(ctx, () => {
            updateCanvas(canvas);
        });
        window.requestAnimationFrame(renderLoop);
    };
    const uiLoop = () => {
        ui.update();
        ui.render();
    };
    const updateDelay = deltaTime * 700 * SIMULATION_BUFFER_SIZE;
    const uiDelay = 300;
    const updateLoopInterval = setInterval(updateLoop, updateDelay);
    const uiLoopInterval = setInterval(uiLoop, uiDelay);
    renderLoop();
};

window.onload = () => {
    start();
}