import * as BABYLON from "babylonjs"
import eventManager from "app/shared/eventManager";

import Loader from "app/loader/index";

import Buttons from "./buttons/index"
import DefaultStructure from "./defaultStructure";

export default class ObjectsController {
    scene: BABYLON.Scene;

    private data = {
        load: false,
    }

    types: Array<any> = [];

    interactiveObjects: Array<DefaultStructure> = [];

    constructor(private loader: Loader) {
        this.loader.objectsController = this;
        this.initTypes();

        eventManager.on("loader.sceneLoaded", {}, () => {
            this.data.load = true;
        });
    }

    isLoad() {
        return this.data.load;
    }

    initTypes() {
        this.types.push(...Buttons);

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
        
        const instance = new type.default(mesh, data) as DefaultStructure;

        if (instance.require.playerController) {
            instance.playerController = this.loader.playerController;
        }
        if (instance.require.objectsController) {
            instance.objectsController = this.loader.objectsController;
        }
        if (instance.require.entitiesController) {
            instance.entitiesController = this.loader.entitiesController;
        }
        if (instance.require.sceneryController) {
            instance.sceneryController = this.loader.sceneryController;
        }

        if (!mesh.metadata) mesh.metadata = {};

        mesh.metadata.instance = instance;

        this.interactiveObjects.push(instance);
        instance.load();
    }
}