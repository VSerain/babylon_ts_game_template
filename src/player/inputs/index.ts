import * as BABYLON from "babylonjs"

import JumpInput from "./jumpInput"
import GameInput from "./gameInput";

/**
 * InputManager manage the player input
 */
export default class InputManager {
    private gameInput: GameInput = new GameInput();
    private jumpInupt: JumpInput;

    constructor(private scene: BABYLON.Scene, private camera: BABYLON.UniversalCamera, private canvas: HTMLCanvasElement) {
        this.canvas.requestPointerLock();
        this.jumpInupt = new JumpInput(this.scene);
        this.camera.inputs.add(this.jumpInupt);

        this.camera.inputs.add(this.gameInput as any);

        this.camera.attachControl(this.canvas, false);
        this.attachZQSD(); // TODO change by parametrics key
    }

    attachZQSD() {
        this.camera.keysDown.push(83);
        this.camera.keysUp.push(90);
        this.camera.keysRight.push(68);
        this.camera.keysLeft.push(81);
    }

    renderLoop() {
        this.jumpInupt.renderLoop();
    }
}