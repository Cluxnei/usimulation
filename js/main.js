import {initCanvas, updateCanvas} from './canvas.js';
import {
    FIXED_DT,
    INITIAL_PLANETS_COUNT, MAX_PLANET_RADIUS,
    MIN_PLANET_RADIUS,
    SIMULATION_BUFFER_SIZE,
    UNIVERSE_SIZE_SCREEN_MULTIPLIER
} from './constants.js';
import {Universe} from './universes.js';
import {Vector2} from './vectors.js';
import {ChunkController} from './chunks.js';
import {Simulation} from './simulation.js';
import {Ui} from './ui.js';
import {delay} from './helpers.js';
import {PlanetGenerator} from './planets.js';

const start = () => {
    const canvas = initCanvas();
    const ctx = canvas.getContext('2d');

    const universeSize = new Vector2(
        canvas.width * UNIVERSE_SIZE_SCREEN_MULTIPLIER,
        canvas.height * UNIVERSE_SIZE_SCREEN_MULTIPLIER
    );

    const planetGenerator = new PlanetGenerator();
    planetGenerator.setRadiusRange(MIN_PLANET_RADIUS, MAX_PLANET_RADIUS);

    planetGenerator.setPositionRange(
        new Vector2(-universeSize.x, universeSize.x),
        new Vector2(-universeSize.y, universeSize.y)
    );

    const chunkController = new ChunkController(
        planetGenerator,
        INITIAL_PLANETS_COUNT
    );

    const universe = new Universe(
        universeSize,
        chunkController
    );

    const simulation = new Simulation(universe, SIMULATION_BUFFER_SIZE);
    const ui = new Ui(simulation, canvas, ctx);

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
    uiLoop(300).then(() => {
        console.log('ui loop started');
    });

    console.log(simulation);
};

window.onload = () => {
    start();
    console.log('simulation started');
}