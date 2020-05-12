import * as BABYLON from "babylonjs"

import FpsInput from "./fpsInput";
import FPSCamera from "../fpsCamera";

/**
 * InputManager manage the player input
 */
export default class InputManager {
    private fpsInput: FpsInput;
    private scene: BABYLON.Scene;
    private canvas: HTMLCanvasElement;

    constructor(private camera: FPSCamera) {
        this.scene = camera.getScene();
        this.canvas = this.scene.getEngine().getRenderingCanvas() as HTMLCanvasElement;

        this.canvas.requestPointerLock();
        this.fpsInput = new FpsInput();
        this.camera.inputs.clear();

        this.camera.inputs.add(this.fpsInput as any);
        this.camera.inputs.addMouse();
        this.camera.attachControl(this.canvas);
    }
}