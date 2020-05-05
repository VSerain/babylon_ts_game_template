import * as BABYLON from "babylonjs"

import FpsInput from "./fpsInput";

/**
 * InputManager manage the player input
 */
export default class InputManager {
    private fpsInput: FpsInput = new FpsInput();

    constructor(private scene: BABYLON.Scene, private camera: BABYLON.UniversalCamera, private canvas: HTMLCanvasElement) {
        this.canvas.requestPointerLock();
        this.camera.inputs.clear();

        this.camera.inputs.add(this.fpsInput as any);
        this.camera.inputs.addMouse();
        this.camera.attachControl(this.canvas);
        // this.attachZQSD(); // TODO change by parametrics key
    }

    attachZQSD() {
        this.camera.keysDown.push(83);
        this.camera.keysUp.push(90);
        this.camera.keysRight.push(68);
        this.camera.keysLeft.push(81);
    }

    renderLoop() {
        this.fpsInput.renderLoop();
    }
}