import {BACKGROUND_COLOR} from './constants.js';

export const initCanvas = () => {
    const canvas = document.querySelector('#canvas');
    canvas.zoom = 1;
    canvas.positionX = 0;
    canvas.positionY = 0;


    canvas.addEventListener('mousemove', event => {
        if(!canvas.dragging) {
            return;
        }
        canvas.positionX = (canvas.positionX || 0) + event.movementX;
        canvas.positionY = (canvas.positionY || 0) + event.movementY;
    })

    canvas.addEventListener('mousedown', () => {
        canvas.dragging = true;
    });

    canvas.addEventListener('mouseup', () => {
        canvas.dragging = false;
    });

    canvas.addEventListener('wheel', event => {
        canvas.zoom -= event.deltaY / 1000 * canvas.zoom;
    });

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();

    window.addEventListener('resize',resizeCanvas,false);

    return canvas;
};

export const updateCanvas = canvas => {
    const ctx = canvas.getContext('2d');
    const zoom = canvas.zoom;
    const x = canvas.positionX || 0;
    const y = canvas.positionY || 0;
    ctx.resetTransform();
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.translate(canvas.clientWidth / 2 + x, canvas.clientHeight / 2 + y);
    ctx.scale(zoom, zoom);
};