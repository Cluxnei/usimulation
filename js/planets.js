import {Vector2} from './vectors.js';
import {rand} from './helpers.js';

export class Planet {
    constructor(position, velocity, radius, density) {
        this.radius = radius;
        this.density = density;
        this.volume = 4 / 3 * Math.PI * Math.pow(this.radius, 3);
        this.mass = this.density * this.volume;

        this.position = position;
        this.velocity = velocity;
        this.acceleration = new Vector2();
        this.forces = new Vector2();
    }

    getState() {
        return {
            position: this.position,
            radius: this.radius,
            color: '#f1f',
        };
    }

}

export class PlanetGenerator {

    constructor() {
        this.radiusRange = [1, 1];
        this.densityRange = [1, 1];

        this.positionRange = [
            new Vector2(),
            new Vector2(),
        ];
        this.velocityRange = [
            new Vector2(),
            new Vector2(),
        ];
    }

    generatePlanet() {
        return new Planet(
            this.generatePosition(),
            this.generateVelocity(),
            this.generateRadius(),
            this.generateDensity()
        );
    }

    generatePosition() {
        const x = rand(this.positionRange[0].x, this.positionRange[0].y);
        const y = rand(this.positionRange[1].x, this.positionRange[1].y);
        return new Vector2(x, y);
    }

    generateVelocity() {
        const x = rand(this.velocityRange[0].x, this.velocityRange[0].y);
        const y = rand(this.velocityRange[1].x, this.velocityRange[1].y);
        return new Vector2(x, y);
    }

    generateRadius() {
        return rand(this.radiusRange[0], this.radiusRange[1]);
    }

    generateDensity() {
        return rand(this.densityRange[0], this.densityRange[1]);
    }

    setRadiusRange(min, max) {
        this.radiusRange = [min, max];
    }

    setPositionRange(min, max) {
        this.positionRange = [min, max];
    }
}