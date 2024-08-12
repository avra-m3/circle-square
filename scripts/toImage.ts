import { getAllObjects, disconnect } from '@/components/firebase/database';
import { Circle, Rect, setEnv, StaticCanvas } from 'fabric';
import * as fs from 'node:fs';
import { JSDOM } from 'jsdom';

/**
 * Class representing a custom canvas for rendering.
 * Extends the StaticCanvas from the fabric library.
 */
class RenderCanvas extends StaticCanvas {
    /**
     * Creates an instance of RenderCanvas.
     * @param {HTMLCanvasElement} canvas - The HTML canvas element.
     */
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.setZoom(0.12);
    }
}

/**
 * Main function to render objects onto a canvas and save as an SVG file.
 * This function sets up the environment, fetches objects from a database,
 * renders them on a canvas, and saves the result as an SVG file.
 */
const main = async () => {
    // Create a new JSDOM instance to simulate a browser environment.
    const jsdom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
    const window = jsdom.window;

    // Set up the environment for the fabric library.
    setEnv({
        isTouchSupported: false,
        dispose: () => null,
        copyPasteData: {} as any,
        WebGLProbe: undefined as any,
        window,
        document: window.document
    });

    // Fetch all objects from the Firebase database.
    const objects = await getAllObjects();
    // Disconnect from the database to free up resources.
    disconnect();

    // Create a new RenderCanvas instance.
    const canvas = new RenderCanvas(jsdom.window.document.createElement('canvas'));

    // Iterate over the fetched objects and add them to the canvas.
    for (const id in objects) {
        const { type, ...representation } = objects[id] as { type: string };
        if (type === "Circle") {
            canvas.add(new Circle(representation));
        } else if (type === "Rect") {
            canvas.add(new Rect(representation));
        }
    }

    // Save the canvas content as an SVG file.
    fs.writeFileSync('snapshot.svg', canvas.toSVG());
}

// Call the main function to execute the rendering process.
main();