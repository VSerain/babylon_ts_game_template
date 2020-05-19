import * as BABYLON from "babylonjs";

import eventManager from "app/shared/eventManager";
import Structure from "app/shared/structure";

export const name = "default-weapon";

export const glb = "weapon.glb"

export default class DefaultWeapon extends Structure {
    weaponName: string = name;
    isAttached: boolean = false;
    entries: BABYLON.InstantiatedEntries;

    constructor() {
        super(new BABYLON.Mesh("tmpMesh"), {});
        this.require.playerController = true;
        this.require.entitiesController = true;
    }

    load() {
        eventManager.on("player.activeWeapon", {}, (cbStop, weapon) => {
            if (this.name !== weapon.name) return;
            this.attachToPlayer();
        });
        eventManager.on("player.unactiveWeapon", {}, (cbStop, weapon) => {
            if (this.name !== weapon.name) return;
            this.detachToPlayer();
        });

        this.playerController.addWeapon(this);
    }

    attachToPlayer() {
        this.isAttached = true;
        this.entries = this.entitiesController.store.getEntries(name);
        this.entries.rootNodes[0].parent = this.playerController.camera;

        this.entries.rootNodes[0].position = new BABYLON.Vector3(0.2, -0.6 ,1.1);
        
        // @TODO remove me
        this.entries.rootNodes[0].rotation = new BABYLON.Vector3(0, 1.54 ,0);
        this.entries.rootNodes[0].scaling = new BABYLON.Vector3(0.2,0.2,0.2);

    }

    detachToPlayer() {
        this.isAttached = false;
        this.entries.rootNodes[0].parent = null;
        this.entries.rootNodes[0].dispose();
    }

}