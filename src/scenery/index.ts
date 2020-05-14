import * as BABYLON from "babylonjs";
import eventManager from "app/shared/eventManager";
import Structure from "app/shared/structure";
import { applyController, StructureConstructor} from "app/shared/structure-helpers";

import Loader from "app/loader/index";

import Types from "./types/index";
import Ground from "./types/ground";

interface Type {
    name: string,
    class: StructureConstructor
}

export default class SceneryController {
    _scene: BABYLON.Scene;

    private _types: Array<Type> = [];

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
        
        this._types.push({
            name: "default",
            class: Structure as StructureConstructor
        });
        Types.forEach((type: any) => {
            this._types.push({
                name: type.name as string,
                class: type.default as StructureConstructor
            })
        });

        this._types.forEach(type => {
            this.loader.addSceneryType(type.name);
        })

    }

    /**
     * Is call by the loader when mesh added is corresponding to the player type
     */
    addMesh(typeName: string, mesh: BABYLON.AbstractMesh, data?: any) {
        const type = this._types.find((type) => type.name == typeName);
        if (!type) return;

        if (!mesh.metadata) mesh.metadata = {};

        const instance = new type.class(mesh as BABYLON.Mesh, data);

        applyController(instance, this.loader);

        this.sceneObjects.push(instance);

        instance.load();
    }
}