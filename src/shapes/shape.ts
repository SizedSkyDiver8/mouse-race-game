abstract class Shape {
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;
  protected color: string;
  private angle: number = 0;
  private func: Function | null = null;
  protected isProcessed: boolean = false; //Flag to check that the shape would not count few times on click

  /**
   * Constructor to initialize the shape with position and dimensions.
   * @param x X-coordinate of the shape's initial position.
   * @param y Y-coordinate of the shape's initial position.
   * @param width Width of the shape.
   * @param height Height of the shape.
   * @param color Color of the shape.
   */
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.color = color;
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract update(canvas: HTMLCanvasElement): void;
  abstract onClicked(): boolean;

  //Checking that we are inside the bound of the canvas
  protected checkBounds(canvas: HTMLCanvasElement): void {
    if (this.x < 0 || this.x + this.width > canvas.width) {
      this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));
    }
    if (this.y < 0 || this.y + this.height > canvas.height) {
      this.y = Math.max(0, Math.min(this.y, canvas.height - this.height));
    }
  }

  public updateBounds(canvas: HTMLCanvasElement): void {
    this.checkBounds(canvas);
  }

  setAngle(angle: number): void {
    this.angle = angle;
  }

  getAngle(): number {
    return this.angle;
  }

  setFunc(func: Function): void {
    this.func = func;
  }

  getFunc(): Function | null {
    return this.func;
  }

  public getX(): number {
    return this.x;
  }

  public setX(x: number): void {
    this.x = x;
  }

  public getY(): number {
    return this.y;
  }

  public setY(y: number): void {
    this.y = y;
  }

  public getWidth(): number {
    return this.width;
  }
  public getHeight(): number {
    return this.height;
  }
}

export default Shape;
