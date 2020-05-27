import * as BABYLON from "babylonjs";

import eventManager from "app/shared/eventManager";
import Structure from "app/shared/structure";

export const name = "default-bullet";

export const glb = "bullet.glb";

export default class DefaultBullet extends Structure {
    entries: BABYLON.InstantiatedEntries;
    node: BABYLON.TransformNode;
    parentDirection: BABYLON.Vector3 = new BABYLON.Vector3();
    parentPosition: BABYLON.Vector3 = new BABYLON.Vector3();
    firePower: number = 10;
    maxLifeTime: number = 5000;
    endLifeTimout: number;

    constructor() {
        super(new BABYLON.Mesh("tmpMesh"), {});
        this.require.entitiesController = true;

    }

    load() {
        eventManager.on("player.body.colide", {
            filter: (partName: string, mesh: BABYLON.Mesh, structureColided: Structure) => structureColided === this,
        }, (cbStop, partName: string, mesh: BABYLON.Mesh) => {
            cbStop();
            this.playerTouched(partName, mesh)
        })
    }

    playerTouched(partName: string, mesh: BABYLON.Mesh) {
        console.log("Player as touch at " + partName + " by bullet " + this.name);
        this.dispose();
    }

    fire() {
        this.entries = this.entitiesController.store.getEntries(name);
        this.node = this.entries.rootNodes[0];
        this.mesh = this.node.getChildMeshes()[0] as BABYLON.Mesh;
        this.mesh.scaling = new BABYLON.Vector3(0.04,0.04,0.04);
        this.mesh.setAbsolutePosition(this.parentPosition);

        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 0.1, restitution: 0, ignoreParent: true });
        eventManager.call("player.body.structuresColided.add", [this]);

        this.mesh.physicsImpostor.applyImpulse(this.parentDirection.normalize().scale(this.firePower), this.position);

        this.mesh.physicsImpostor.onCollide = () => {
            this.dispose();
        }

        this.endLifeTimout = setTimeout(() => {
            this.dispose();
        }, this.maxLifeTime);
    }

    dispose() {
        if (this.endLifeTimout) clearTimeout(this.endLifeTimout);
        this.mesh.dispose();
        eventManager.call("player.body.structuresColided.remove", [this]);
        this.entitiesController.disposeEntity(this);
    }
}