import * as BABYLON from "babylonjs";

import Loader from "app/loader/index";
import Store from "./store";
import eventManager from "app/shared/eventManager";

export default class EntitiesController {
    scene: BABYLON.Scene;
    store: Store;

    constructor(private loader: Loader) {
        this.loader.entitiesController = this;
        this.store = new Store(this.loader);
        this.store.addAssets("default-weapon", "weapon.glb");

        eventManager.on("loader.sceneLoaded", {}, () => {
            // this.devSpawnWeapon();
        });
    }

    renderLoop() {}

    addMesh(type: string, mesh: BABYLON.AbstractMesh, data?: any) {

    }

    devSpawnWeapon() {
        setTimeout(() => {
            const entries = this.store.getEntries("default-weapon");
            entries.rootNodes[0].position.x += 3;
            entries.rootNodes[0].position.z += 3;
            entries.rootNodes[0].position.y = 1.75;

            entries.rootNodes[0].scaling = new BABYLON.Vector3(0.2,0.2,0.2);
        }, 2000);
    }
}