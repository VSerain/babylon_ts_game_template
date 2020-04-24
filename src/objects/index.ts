import * as BABYLON from "babylonjs"

import Loader from "app/loader/index";

import Buttons from "./buttons/index"
export default class ObjectsController {
    scene: BABYLON.Scene;

    types: Array<any> = [];

    interactiveObjects: Array<any> = [];

    constructor(private loader: Loader) {
        this.loader.objectsController = this;
        this.initTypes();
    }

    initTypes() {
        this.types.push(...Buttons);

        this.types.forEach((module) => {
            this.loader.addObjectsType(module.name);
        });
    }

    renderLoop() {
        this.interactiveObjects.forEach( object => {
            object.renderLoop();
        });
    }

    addMesh(typeName: string, mesh: BABYLON.AbstractMesh, data?: any) {
        const type = this.types.find((type) => type.name == typeName);
        if (!type) return;
        
        const instance = new type.default(mesh as any, this.loader, data);

        if (!mesh.metadata) mesh.metadata = {};

        mesh.metadata.instance = instance;
        this.interactiveObjects.push(instance);
    }
}