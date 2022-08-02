import {initCanvas, updateCanvas} from './canvas.js';
import {FIXED_DT, SIMULATION_BUFFER_SIZE, UNIVERSE_SIZE_SCREEN_MULTIPLIER} from './constants.js';
import {FiniteUniverse} from './universes.js';
import {Vector2} from './vectors.js';
import {ChunkController} from './chunks.js';
import {Simulation} from './simulation.js';
import {Ui} from './ui.js';
import {delay} from './helpers.js';

const start = () => {
    const canvas = initCanvas();
    const ctx = canvas.getContext('2d');

    const chunkController = new ChunkController();

    const universeSize = new Vector2(
        canvas.width * UNIVERSE_SIZE_SCREEN_MULTIPLIER,
        canvas.height * UNIVERSE_SIZE_SCREEN_MULTIPLIER
    );
    const universe = new FiniteUniverse(
        universeSize,
        chunkController
    );

    const simulation = new Simulation(universe, SIMULATION_BUFFER_SIZE);
    const ui = new Ui(simulation);

    const deltaTime = FIXED_DT;

    const updateLoop = async (delayMs) => {
        simulation.update(deltaTime);
        await delay(delayMs);
        updateLoop(delayMs);
    };
    const renderLoop = () => {
        simulation.render(ctx, () => {
            updateCanvas(canvas);
        });
        window.requestAnimationFrame(renderLoop);
    };
    const uiLoop = async (delayMs) => {
        ui.update();
        ui.render();
        await delay(delayMs);
        uiLoop(delayMs);
    };
    // Start the update and render loops
    updateLoop(deltaTime * 1000).then(() => {
        console.log('update loop started');
        renderLoop();
        console.log('render loop started');
    });
    // Start the ui loop
    uiLoop(500).then(() => {
        console.log('ui loop started');
    });

    console.log(simulation);
};

window.onload = () => {
    start();
    console.log('simulation started');
}