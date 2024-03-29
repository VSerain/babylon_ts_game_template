import * as BABYLON from "babylonjs"

import { MINIMAL_DIST_EVENT } from "app/objects/constants";
import eventManager from "app/shared/eventManager";

import BaseStructure from "app/shared/object-structure";

export const name = "weapon-spawner";

export default class WeaponSpawner extends BaseStructure {

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
        this.require.sceneryController = true;
    }

    load() {
        eventManager.on("player.input.interactive.on", {}, (cbStop) => {
            if (!this.eventActive || this.representationNode.isDisposed()) return
            this.representationNode.dispose();
            const structure = this.entitiesController.createEntities(this.weaponName) as any;
            this.playerController.camera.addWeapon(structure);
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
        this.representationNode.position = this.position.add(new BABYLON.Vector3(0, 0.75, 0));
        this.representationNode.rotation = new BABYLON.Vector3(0, 0, 0);

        const animation = new BABYLON.Animation("rotate0", "rotation.y", 1, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        animation.setKeys([
            {
                frame: 0,
                value: this.representationNode.rotation.y
            },
            {
                frame: 20,
                value: this.representationNode.rotation.y - Math.PI * 2
            }
        ]);
        this.representationNode.animations.push(animation);
        this.sceneryController.scene.beginDirectAnimation(this.representationNode, [animation] , 0, 20, true);
    }

}