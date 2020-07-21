import * as BABYLON from "babylonjs"
import eventManager from "app/shared/eventManager";
import BaseStructure from "app/shared/object-structure";
import * as structureHelpers from "app/shared/structure-helpers";

import Loader from "app/loader/index";

import Buttons from "./buttons/index";
import Spawners from "./spawner/index";
import Interactives from "./interactives/index";

export default class ObjectsController {
    scene: BABYLON.Scene;

    private data = {
        load: false,
    }

    types: Array<any> = [];

    interactiveObjects: Array<BaseStructure> = [];

    constructor(private loader: Loader) {
        this.loader.objectsController = this;
        this.initTypes();

        eventManager.on("loader.sceneLoaded", {}, () => {
            this.data.load = true;
            this.interactiveObjects.forEach(object => object.load());
        });
    }

    isLoad() {
        return this.data.load;
    }

    initTypes() {
        this.types.push(...Buttons);
        this.types.push(...Spawners);
        this.types.push(...Interactives);

        this.types.forEach((module) => {
            this.loader.addObjectsType(module.name);
        });
    }

    renderLoop() {
        if (!this.isLoad()) return;
        this.interactiveObjects.forEach(object => {
            object.renderLoop();
        });
    }

    addMesh(typeName: string, mesh: BABYLON.AbstractMesh, data?: any) {
        const type = this.types.find((type) => type.name == typeName);
        if (!type) return;

        if (!mesh.metadata) mesh.metadata = {};
        
        const instance = new type.default(mesh, data) as BaseStructure;

        structureHelpers.applyController(instance, this.loader);

        this.interactiveObjects.push(instance);

        if (this.isLoad()) instance.load();
    }

    disposeObject(disposedObject: BaseStructure) {
        const objectIndex = this.interactiveObjects.findIndex(object => object === disposedObject);
        if (objectIndex === -1) return;
        this.interactiveObjects.splice(objectIndex, 1);
    }
}