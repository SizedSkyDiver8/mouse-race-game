import Shape from "./shape";
import { MovementStrategy, HorizontalMovement } from "./movementStrategies";

class Avoid extends Shape {
  private movementStrategy: MovementStrategy; //Horizontal movement

  /**
   * Constructs a new Avoid object.
   * @param x - The initial x-coordinate.
   * @param y - The initial y-coordinate.
   * @param width - The width of the avoid object.
   * @param height - The height of the avoid object.
   * @param color - The color of the avoid object (default is "red").
   * @param stopGame - Callback function to stop the game.
   */
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string = "red",
    stopGame: () => void
  ) {
    super(x, y, width, height, color);
    this.setFunc(stopGame);
    this.movementStrategy = new HorizontalMovement();
    setInterval(() => {
      (this.movementStrategy as HorizontalMovement).toggleDirection();
    }, 3000);
  }

  /**
   * Draws the avoid object on the canvas as a filled circle.
   * @param ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    const radius = Math.min(this.width, this.height) / 2;
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  /**
   * Updates the position and behavior of the avoid object.
   * @param canvas - The HTML canvas element.
   */
  update(canvas: HTMLCanvasElement): void {
    this.movementStrategy.move(this, canvas);
  }

  /**
   * Handles click events on the avoid object.
   * @returns Always returns false (game cannot be won by clicking avoid objects).
   */
  onClicked(): boolean {
    const gameOver = this.getFunc();
    if (gameOver) {
      gameOver();
    }
    return false;
  }
}

export default Avoid;
