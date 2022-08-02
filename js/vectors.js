export class Vector2 {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    scale(scaleX = 1, scaleY = undefined) {
        this.x *= scaleX;
        this.y *= typeof scaleY === 'undefined' ? scaleX : scaleY;
        return this;
    }

    magnitude() {
        return Math.hypot(this.x, this.y);
    }

    normalize() {
        const magnitude = this.magnitude();
        this.x /= magnitude;
        this.y /= magnitude;
        return this;
    }

    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x;
        const y = this.y;
        this.x = x * cos - y * sin;
        this.y = x * sin + y * cos;
        return this;
    }

    rotateAround(angle, center) {
        this.sub(center);
        this.rotate(angle);
        this.add(center);
        return this;
    }

    map(callback) {
        this.x = callback(this.x);
        this.y = callback(this.y);
        return this;
    }

    reduce(callback, initialValue) {
        let result = initialValue;
        this.map(value => result = callback(result, value));
        return result;
    }
}