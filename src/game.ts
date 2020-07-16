import * as BABYLON from "babylonjs";

import { ENGINE_CONFIG } from "app/config";

import Loader from "app/loader/index";
import PlayerController from "app/player/index";
import SceneryController from "app/scenery/index";
import ObjectsController from "app/objects/index";
import EntitiesController from "app/entities/index";
import eventManager from "app/shared/eventManager";

export default class Game {

    private isFullLoad: boolean = false;
    private lockPointer: boolean = true;

    private canvas: HTMLCanvasElement;
    private engine: BABYLON.Engine;

    private loader: Loader;
    private playerController: PlayerController;
    private sceneryController: SceneryController;
    private objectsController: ObjectsController;
    private entitiesController: EntitiesController;

    /**
     * 
     * @param canvasId is the DOM id of the element canvas
     */
    constructor(private canvasId: string) {
        this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
        if (!this.canvas) throw new Error(`${this.canvasId} is not found in DOM`);

        this.canvas.addEventListener("click", () => {
            if (!this.lockPointer) return;
            this.canvas.requestPointerLock(); // Lock pointer to game
        });

        this.attachCallback();

        this.engine = new BABYLON.Engine(this.canvas, ENGINE_CONFIG.ANTIALIAS);
        this.engine.loadingScreen.loadingUIText = "KývosStudio";

        this.loader = new Loader(this.engine, this.canvas);
        this.playerController = new PlayerController(this.loader);
        this.sceneryController = new SceneryController(this.loader);
        this.objectsController = new ObjectsController(this.loader);
        this.entitiesController = new EntitiesController(this.loader);

        this.loader.loadScene();

        this.engine.runRenderLoop(() => {
            this.playerController.renderLoop();
            this.sceneryController.renderLoop();
            this.objectsController.renderLoop();
            this.entitiesController.renderLoop();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        eventManager.add("game.debug");
    }

    attachCallback() {
        eventManager.on("loader.sceneLoaded", {}, () => this.isFullLoad = true);
    }

    debugCamera() {
        if (!this.isFullLoad) return;
        this.lockPointer = false;
        const scene = this.loader.scene;
        const cameraDebug = new BABYLON.UniversalCamera("debug-camera", new BABYLON.Vector3(23,9,26), scene);
        cameraDebug.attachControl(this.loader.canvas);

        cameraDebug.angularSensibility = 4000;

        cameraDebug.keysDown = [83];
        cameraDebug.keysUp = [90];
        cameraDebug.keysRight = [68];
        cameraDebug.keysLeft = [81];
        scene.activeCamera = cameraDebug;

        scene.debugLayer.show()

        eventManager.call("game.debug");
    }
}