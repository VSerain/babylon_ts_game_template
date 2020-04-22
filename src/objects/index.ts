import * as BABYLON from "babylonjs"

import Loader from "../loader/index";

export default class ObjectsController {
    scene: BABYLON.Scene;

    constructor(private loader: Loader) {
        this.loader.objectsController = this;
    }

    renderLoop() {}

    addMesh(type: string, mesh: BABYLON.AbstractMesh, data?: any) {

    }
}