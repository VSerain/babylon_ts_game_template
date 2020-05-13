import * as BABYLON from "babylonjs";
import eventManager from "app/shared/eventManager";

import Loader from "app/loader/index";

import Types from "./types/index";
import Ground from "./types/ground";

export default class SceneryController {
    _scene: BABYLON.Scene;

    load: boolean = false;
    sceneObjects: Array<any> = [];

    constructor(private loader: Loader) {
        this.loader.sceneryController = this;

        this.initType();

        eventManager.on("loader.sceneLoaded", { layer: 0 }, () => {
            this.load = true;
            if (this.sceneObjects.find(object => object instanceof Ground)) return;

            const ground = BABYLON.GroundBuilder.CreateGround("ground", { width: 100, height: 100}, this.scene);

            this.addMesh("ground", ground);
        });
    }

    /**
     * Game loop
     */
    renderLoop() {
        if (!this.scene || !this.load) return;
        this.scene.render();
    }

    get scene() {
        return this._scene;
    }
    set scene(scene: BABYLON.Scene) {
        this._scene = scene;
        this.initScene();
    }

    /**
     * Initailize the scene 
     */
    initScene() {
        this.scene.gravity = new BABYLON.Vector3(0, -0.4, 0);
        this.scene.enablePhysics(this.scene.gravity);
        this.scene.collisionsEnabled = true;
    }

    /**
     * Add scenery type to the loader
     */
    initType() {
        Types.forEach(type => {
            this.loader.addSceneryType(type.name);
        });
    }

    /**
     * Is call by the loader when mesh added is corresponding to the player type
     */
    addMesh(typeName: string, mesh: BABYLON.AbstractMesh, data?: any) {
        const type = Types.find((type) => type.name == typeName);
        if (!type) return;
        const instance = new type.default(mesh as any, data);

        if (!mesh.metadata) mesh.metadata = {};

        mesh.metadata.instance = instance;
        this.sceneObjects.push(instance);
    }
}