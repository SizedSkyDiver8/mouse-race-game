import Shape from "./shape.js";
import { RotationMovement } from "./movementStrategies.js";
class Change extends Shape {
    /**
     * Constructs a new Change object.
     * @param x - The initial x-coordinate.
     * @param y - The initial y-coordinate.
     * @param width - The width of the change object.
     * @param height - The height of the change object.
     * @param stopGame - Callback function to stop the game.
     */
    constructor(x, y, width, height, stopGame) {
        super(x, y, width, height, "green");
        this.movementStrategy = new RotationMovement();
        this.isVisible = true;
        this.setFunc(stopGame);
        setInterval(() => this.toggleState(), 2000);
    }
    /**
     * Draws the change object on the canvas.
     * @param ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (!this.isVisible)
            return; // Skip drawing if not visible
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Translate to the center of the object
        ctx.rotate(this.getAngle()); // Rotate based on the current angle of the object
        ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height); // Draw rectangle with current position and size
        ctx.restore();
    }
    /**
     * Updates the position and behavior of the change object.
     * @param canvas - The HTML canvas element.
     */
    update(canvas) {
        this.movementStrategy.move(this, canvas);
    }
    /**
     * Toggles the state of the change object (changes color).
     * Called at intervals to alternate between green and red.
     */
    toggleState() {
        if (this.color === "green") {
            this.color = "red";
        }
        else {
            this.color = "green";
        }
    }
    /**
     * Handles click events on the change object.
     * If clicked:
     * - If green, marks as processed and hides the object (returns true).
     * - If red, executes the stopGame function and returns false (game stopped, object not removed).
     * @returns True if the object was clicked and processed; false otherwise.
     */
    onClicked() {
        if (this.isProcessed)
            return false;
        this.isProcessed = true;
        if (this.color === "red") {
            const stopGame = this.getFunc();
            if (stopGame) {
                stopGame();
            }
            return false;
        }
        else {
            this.isVisible = false;
            return true;
        }
    }
}
export default Change;
