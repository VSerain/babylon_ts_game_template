import * as BABYLON from "babylonjs";

import DefaultStructure from "../defaultStructure";

import { MINIMAL_DIST_EVENT } from "app/objects/constants";
import eventManager from "app/shared/eventManager";

export const name = "default-button"

export default class DefaultButton extends DefaultStructure {
    eventActive: boolean = false;

    constructor(mesh: BABYLON.Mesh, data: any = {}) {
        super(mesh);
        this.require.playerController = true;
        this.require.sceneryController = true;
    }

    load() {
        // Manage callback
        eventManager.on("player.input.interactive.on", {}, () => {
            if (!this.eventActive) return;
            this.startEvent();
        });
    }

    renderLoop() {
        const distanceToPlayer = BABYLON.Vector3.Distance(this.position, this.playerController.body.position);
        this.eventActive = distanceToPlayer < MINIMAL_DIST_EVENT;
        if (this.eventActive) {
            console.log("Please press key E");
        }
    }

    startEvent() {
        // TEST
        this.sceneryController.sceneObjects[0].position = this.position.add(new BABYLON.Vector3(5,0,5));
    }
}