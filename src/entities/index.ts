import * as BABYLON from "babylonjs";

import Loader from "../loader/index";

export default class EntitiesController {
    scene: BABYLON.Scene;

    constructor(private loader: Loader) {
        this.loader.entitiesController = this;
    }

    renderLoop() {}

    addMesh(type: string, mesh: BABYLON.AbstractMesh, data?: any) {

    }
}