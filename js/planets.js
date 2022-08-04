import {Vector2} from './vectors.js';
import {newtonGravitationLaw, rand} from './helpers.js';

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

    isPositionOutsideLimits(position, limits) {
        if (!position) {
            position = this.position;
        }
        return position.x + this.radius > limits.right
        || position.x - this.radius < limits.left
        || position.y + this.radius > limits.top
        || position.y - this.radius < limits.bottom;
    }

    isPositionOutsideChunkLimits(position, chunkLimits) {
        if (!position) {
            position = this.position;
        }
        return position.x < chunkLimits.left
            || position.x > chunkLimits.right
            || position.y > chunkLimits.bottom
            || position.y < chunkLimits.top;
    }

    updatePosition(deltaTime, limits) {
        this.acceleration = this.forces.copy().scale(1 / this.mass);
        this.velocity.add(this.acceleration.copy().scale(deltaTime));
        const nextPosition = this.position.copy().add(this.velocity.copy().scale(deltaTime));
        if (this.isPositionOutsideLimits(nextPosition, limits)) {
            this.acceleration = new Vector2();
            this.velocity = new Vector2();
            return;
        }
        this.position = nextPosition;
    }

    attractionTo(otherPlanet){
        if(otherPlanet === this) {
            return new Vector2();
        }
        const distanceBetweenPlanets = otherPlanet.position.copy().sub(this.position);
        const distanceBetweenPlanetsScalar = distanceBetweenPlanets.magnitude();
        const forceScalar = newtonGravitationLaw(this.mass, otherPlanet.mass,distanceBetweenPlanetsScalar);
        return distanceBetweenPlanets.normalize().scale(forceScalar);
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
            new Vector2(-100, 100),
            new Vector2(-100, 100),
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