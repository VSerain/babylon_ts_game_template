import * as BABYLON from "babylonjs"

import { MINIMAL_DIST_EVENT } from "app/objects/constants";
import eventManager from "app/shared/eventManager";

import Structure from "app/shared/structure";

export const name = "weapon-spawner";

export default class WeaponSpawner extends Structure {

    private weaponName: string;
    private eventActive: boolean = false;
    private representationNode: BABYLON.TransformNode;

    /**
     * @param mesh Structrue mesh
     * @param data params of structure
     * @param data.name is the unique name of structrue
     * @param data.weapon is the name of entities to spawn
     */
    constructor(mesh: BABYLON.Mesh, private data: any = {}) {
        super(mesh, data);
        this.weaponName = data.weapon;
        this.require.entitiesController = true;
        this.require.playerController = true;
    }

    load() {
        eventManager.on("player.input.interactive.on", {}, (cbStop) => {
            if (!this.eventActive || this.representationNode.isDisposed()) return
            this.representationNode.dispose();
            this.entitiesController.createEntities(this.weaponName);
            cbStop();
        });

        this.spawnMeshRepresentation();
    }
    renderLoop() {
        const distanceToPlayer = BABYLON.Vector3.Distance(this.position, this.playerController.camera.position);
        this.eventActive = distanceToPlayer < MINIMAL_DIST_EVENT;
        if (this.eventActive && !this.representationNode.isDisposed()) {
            eventManager.call("interactive-object.message.show");
        }
    }

    spawnMeshRepresentation() {
        const entries = this.entitiesController.store.getEntries(this.weaponName);
        this.representationNode = entries.rootNodes[0];
        this.representationNode.parent = this.mesh;
        this.representationNode.position = new BABYLON.Vector3(0, 1, 0);

        entries.rootNodes[0].scaling = new BABYLON.Vector3(0.2,0.2,0.2); // @TODO: Remove me
    }

}