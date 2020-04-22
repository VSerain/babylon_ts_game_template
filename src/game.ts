import * as BABYLON from "babylonjs";

import { ENGINE_CONFIG } from "./config";

import Loader from "./loader/index";
import PlayerController from "./player/index";
import SceneryController from "./scenery/index";
import ObjectsController from "./objects/index";
import EntitiesController from "./entities/index";

export default class Game {

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

        this.engine = new BABYLON.Engine(this.canvas, ENGINE_CONFIG.ANTIALIAS);

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
    }
}