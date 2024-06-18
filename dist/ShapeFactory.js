import Collect from "./shapes/collect.js";
import Avoid from "./shapes/avoid.js";
import Change from "./shapes/change.js";
/**
 * Creates a shape object based on the provided type.
 *
 * @param type - The type of shape to create ("collect", "avoid", "change").
 * @param x - The x-coordinate position of the shape.
 * @param y - The y-coordinate position of the shape.
 * @param width - The width of the shape.
 * @param height - The height of the shape.
 * @param stopGame - Callback function to stop the game.
 * @returns A new instance of the corresponding shape object.
 * @throws Error if an invalid shape type is provided.
 */
class ShapeFactory {
    static createShape(type, x, y, width, height, stopGame) {
        switch (type) {
            case "collect":
                return new Collect(x, y, width, height, "green", stopGame);
            case "avoid":
                return new Avoid(x, y, width, height, "red", stopGame);
            case "change":
                return new Change(x, y, width, height, stopGame);
            default:
                throw new Error("Invalid shape type");
        }
    }
}
export default ShapeFactory;
