import Collect from "./shapes/collect";
import Avoid from "./shapes/avoid";
import Change from "./shapes/change";

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
  static createShape(
    type: string,
    x: number,
    y: number,
    width: number,
    height: number,
    stopGame: () => void
  ) {
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
