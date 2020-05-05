import * as BABYLON from "babylonjs";

import eventManager from "app/shared/eventManager";

import Loader from "app/loader/index";
import InputManager from "./inputs/index";
import PlayerBody from "./playerBody";
import UI from "./ui/index";

export default class PlayerController {
    scene: BABYLON.Scene;
    camera: BABYLON.UniversalCamera;
    inputManager: InputManager;
    body: PlayerBody;
    ui: UI;

    constructor(private loader: Loader) {
        this.loader.playerController = this;
        this.loader.addPlayerType("player-camera"); 
        this.ui = new UI();
    }

    debug() {
        const cameraDebug = new BABYLON.UniversalCamera("debug-camera", new BABYLON.Vector3(23,9,26), this.scene);
        cameraDebug.attachControl(this.loader.canvas);

        cameraDebug.keysDown = [83];
        cameraDebug.keysUp = [90];
        cameraDebug.keysRight = [68];
        cameraDebug.keysLeft = [81];

        this.scene.activeCamera = cameraDebug;
    }

    /**
     * Game loop
     */
    renderLoop() {
        if (!this.camera || !this.inputManager) return;
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
        this.body = new PlayerBody(this.camera);
        this.inputManager = new InputManager(this.scene, this.camera, this.loader.canvas);
    }
}