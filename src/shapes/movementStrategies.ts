import Shape from "./shape";

//Interface for defining movement strategies.
export interface MovementStrategy {
  move(shape: Shape, canvas: HTMLCanvasElement): void;
}

//Implementation of vertical movement strategy.
export class VerticalMovement implements MovementStrategy {
  private directionY: number = 1;

  /**
   * Moves the shape vertically.
   * @param shape The shape to move.
   * @param canvas The HTML canvas element.
   */
  move(shape: Shape, canvas: HTMLCanvasElement): void {
    shape.setY(shape.getY() + this.directionY * 2);
    shape.updateBounds(canvas);
  }

  //Toggles the vertical movement direction.
  toggleDirection(): void {
    this.directionY *= -1;
  }
}

//Implementation of horizontal movement strategy.
export class HorizontalMovement implements MovementStrategy {
  private directionX: number = 1;

  /**
   * Moves the shape horizontally.
   * @param shape The shape to move.
   * @param canvas The HTML canvas element.
   */
  move(shape: Shape, canvas: HTMLCanvasElement): void {
    shape.setX(shape.getX() + this.directionX * 2);
    shape.updateBounds(canvas);
  }

  //Toggles the horizontal movement direction.
  toggleDirection(): void {
    this.directionX *= -1;
  }
}

//Implementation of rotation movement strategy.
export class RotationMovement implements MovementStrategy {
  private angle: number = 0;
  /**
   * Rotates the shape.
   * @param shape The shape to rotate.
   * @param canvas The HTML canvas element.
   */
  move(shape: Shape, canvas: HTMLCanvasElement): void {
    this.angle += Math.PI / 180;
    shape.setAngle(this.angle);
  }
}
