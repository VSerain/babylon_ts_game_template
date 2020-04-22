import * as BABYLON from "babylonjs";

import Loader from "../loader/index";

import Types from "./types/index";

export default class SceneryController {
    _scene: BABYLON.Scene;

    sceneObjects: Array<any> = [];

    constructor(private loader: Loader) {
        this.loader.sceneryController = this;

        this.initType();
    }

    /**
     * Game loop
     */
    renderLoop() {}

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
        this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
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