class Shape {
    /**
     * Constructor to initialize the shape with position and dimensions.
     * @param x X-coordinate of the shape's initial position.
     * @param y Y-coordinate of the shape's initial position.
     * @param width Width of the shape.
     * @param height Height of the shape.
     * @param color Color of the shape.
     */
    constructor(x, y, width, height, color) {
        this.angle = 0;
        this.func = null;
        this.isProcessed = false; //Flag to check that the shape would not count few times on click
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.color = color;
    }
    //Checking that we are inside the bound of the canvas
    checkBounds(canvas) {
        if (this.x < 0 || this.x + this.width > canvas.width) {
            this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));
        }
        if (this.y < 0 || this.y + this.height > canvas.height) {
            this.y = Math.max(0, Math.min(this.y, canvas.height - this.height));
        }
    }
    updateBounds(canvas) {
        this.checkBounds(canvas);
    }
    setAngle(angle) {
        this.angle = angle;
    }
    getAngle() {
        return this.angle;
    }
    setFunc(func) {
        this.func = func;
    }
    getFunc() {
        return this.func;
    }
    getX() {
        return this.x;
    }
    setX(x) {
        this.x = x;
    }
    getY() {
        return this.y;
    }
    setY(y) {
        this.y = y;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
}
export default Shape;
