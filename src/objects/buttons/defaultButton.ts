import * as BABYLON from "babylonjs";

import DefaultStructure from "../defaultStructure";

import { MINIMAL_DIST_EVENT } from "app/objects/constants";

export const name = "default-button"

export default class DefaultButton extends DefaultStructure {
    constructor(mesh: BABYLON.Mesh, data: any = {}) {
        super(mesh);
        this.require.playerController = true;
    }

    renderLoop() {
        const distanceToPlayer = BABYLON.Vector3.Distance(this.position, this.playerController.body.position);
        if (distanceToPlayer < MINIMAL_DIST_EVENT) {
            console.log("SHOW EVENT MESSAGE");
        }
    }
}