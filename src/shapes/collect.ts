import Shape from "./shape";
import { VerticalMovement } from "./movementStrategies";

class Collect extends Shape {
  private movementStrategy: VerticalMovement; // vertical movement
  private isVisible: boolean; // Flag to control visibility

  /**
   * Constructs a new Collect object.
   * @param x - The initial x-coordinate.
   * @param y - The initial y-coordinate.
   * @param width - The width of the collectible.
   * @param height - The height of the collectible.
   * @param color - The color of the collectible (default is "green").
   * @param stopGame - Callback function to stop the game.
   */
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string = "green",
    stopGame: () => void
  ) {
    super(x, y, width, height, color); // Use the larger dimension for size
    this.width = width;
    this.height = height;
    this.isVisible = true;
    this.movementStrategy = new VerticalMovement();
    setInterval(() => {
      this.movementStrategy.toggleDirection();
    }, 2000);
  }

  /**
   * Draws the collectible on the canvas.
   * @param ctx - The canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.isVisible) return;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  /**
   * Updates the position of the collectible based on its movement strategy.
   * @param canvas - The HTML canvas element.
   */
  update(canvas: HTMLCanvasElement): void {
    this.movementStrategy.move(this, canvas);
  }

  /**
   * Handles click events on the collectible.
   * Marks the collectible as processed, making it no longer clickable.
   * @returns True if the collectible was clicked and processed; false otherwise.
   */
  onClicked(): boolean {
    if (this.isProcessed) return false;
    this.isProcessed = true;
    this.isVisible = false;
    return true;
  }
}

export default Collect;
