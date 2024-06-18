//Implementation of vertical movement strategy.
export class VerticalMovement {
    constructor() {
        this.directionY = 1;
    }
    /**
     * Moves the shape vertically.
     * @param shape The shape to move.
     * @param canvas The HTML canvas element.
     */
    move(shape, canvas) {
        shape.setY(shape.getY() + this.directionY * 2);
        shape.updateBounds(canvas);
    }
    //Toggles the vertical movement direction.
    toggleDirection() {
        this.directionY *= -1;
    }
}
//Implementation of horizontal movement strategy.
export class HorizontalMovement {
    constructor() {
        this.directionX = 1;
    }
    /**
     * Moves the shape horizontally.
     * @param shape The shape to move.
     * @param canvas The HTML canvas element.
     */
    move(shape, canvas) {
        shape.setX(shape.getX() + this.directionX * 2);
        shape.updateBounds(canvas);
    }
    //Toggles the horizontal movement direction.
    toggleDirection() {
        this.directionX *= -1;
    }
}
//Implementation of rotation movement strategy.
export class RotationMovement {
    constructor() {
        this.angle = 0;
    }
    /**
     * Rotates the shape.
     * @param shape The shape to rotate.
     * @param canvas The HTML canvas element.
     */
    move(shape, canvas) {
        this.angle += Math.PI / 180;
        shape.setAngle(this.angle);
    }
}
