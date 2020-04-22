import * as BABYLON from "babylonjs";

import Loader from "../loader/index";
import InputManager from "./inputs/index";
import PlayerBody from "./playerBody";

export default class PlayerController {
    scene: BABYLON.Scene;
    camera: BABYLON.UniversalCamera;
    inputManager: InputManager;
    body: PlayerBody;

    constructor(private loader: Loader) {
        this.loader.playerController = this;
        this.loader.addPlayerType("player-camera"); 
    }

    /**
     * Game loop
     */
    renderLoop() {
        if (!this.camera) return;
        this.scene.render();
        this.inputManager.renderLoop();
    }

    /**
     * Is call by the loader when mesh added is corresponding to the player type
     */
    addMesh(type: string, mesh: BABYLON.AbstractMesh, data?: any) {
        if (type === "player-camera") {
            this.camera = new BABYLON.UniversalCamera("player-camera", mesh.position.clone(), this.scene);
            mesh.dispose();
            this.initCamera();
        }
    }

    /**
     * Init input and body to the camera
     */
    initCamera() {
        this.inputManager = new InputManager(this.scene, this.camera, this.loader.canvas);
        this.body = new PlayerBody(this.camera);
    }
}