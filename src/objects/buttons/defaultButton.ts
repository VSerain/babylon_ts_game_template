import * as BABYLON from "babylonjs";

import Loader from "app/loader/index";
import eventManager from "app/shared/eventManager";
import PlayerBody from "app/player/playerBody";

import { MINIMAL_DIST_EVENT } from "app/objects/constants";

export const name = "default-button"

export default class DefaultButton {
    start: boolean = false;
    playerBody: PlayerBody;
    constructor(private mesh: BABYLON.Mesh, private loader: Loader , data: any = {}) {
        eventManager.on("loader.sceneLoaded", {}, () => {
            this.playerBody = this.loader.playerController.body;
            this.start = true;
        });
    }

    get position() {
        return this.mesh.position;
    }
    set position(position: BABYLON.Vector3) {
        this.mesh.position = position;
    }

    renderLoop() {
        if (!this.start) return;
        const distanceToPlayer = BABYLON.Vector3.Distance(this.position, this.playerBody.position);
        if (distanceToPlayer < MINIMAL_DIST_EVENT) {
            // alert("SHOW EVENT MESSAGE");
        }
    }
}