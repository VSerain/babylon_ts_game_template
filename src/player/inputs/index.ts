import * as BABYLON from "babylonjs"

import FPSCamera from "app/player/fpsCamera";
import FpsInput from "./fpsInput";

/**
 * InputManager manage the player input
 */
export default class InputManager {
    private fpsInput: FpsInput = new FpsInput();
    private scene: BABYLON.Scene;
    private canvas: HTMLCanvasElement;

    constructor(private camera: FPSCamera) {
        this.scene = this.camera.getScene();
        this.canvas = this.scene.getEngine().getRenderingCanvas() as HTMLCanvasElement;

        this.canvas.requestPointerLock();
        this.camera.inputs.clear();

        this.camera.inputs.add(this.fpsInput);
        this.camera.inputs.addMouse();
        this.camera.attachControl(this.canvas);
    }
}