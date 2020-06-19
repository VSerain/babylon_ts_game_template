import * as BABYLON from "babylonjs";


import Loader from "app/loader/index";
import UI from "./ui/index";
import FPSCamera from "./fpsCamera";

export default class PlayerController {
    scene: BABYLON.Scene;
    camera: BABYLON.UniversalCamera;
    canvas: HTMLCanvasElement;
    ui: UI;

    constructor(private loader: Loader) {
        this.loader.playerController = this;
        this.loader.addPlayerType("player-camera"); 
        this.canvas = this.loader.canvas;
        this.ui = new UI();
    }

    /**
     * Game loop
     */
    renderLoop() {}

    /**
     * Is call by the loader when mesh added is corresponding to the player type
     */
    addMesh(type: string, mesh: BABYLON.AbstractMesh, data?: any) {
        if (type === "player-camera") {
            this.camera = new FPSCamera("player-camera", mesh.position.clone(), this.scene);
            mesh.dispose();
        }
    }
}