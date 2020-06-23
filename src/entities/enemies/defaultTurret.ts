import Structure from "app/shared/structure";
import * as BABYLON from "babylonjs";
import { WeaponOwner, Touchable } from "app/entities/interfaces";
import DefaultWeapon from "app/entities/weapons/defaultWeapon";

export const name = "default-turret";

export const glb = "turret.glb";

export default class DefaultTurret extends Structure implements WeaponOwner, Touchable {
    entries: BABYLON.InstantiatedEntries;
    node: BABYLON.TransformNode;
    directionVector: BABYLON.Vector3 = new BABYLON.Vector3(1,0,0);
    weapon: DefaultWeapon;
    weaponName: string = "default-weapon";

    lastFire: number = 0;
    timeBeetwenFire: number = 0.8;

    life: number = 3;

    constructor() {
        super(new BABYLON.Mesh("tmpMesh"), {name: "DefaultTurret"});
        this.require.entitiesController = true;
        this.require.playerController = true;
    }


    load() {
        this.entries = this.entitiesController.store.getEntries(name);
        this.node = this.entries.rootNodes[0];
        this.mesh = this.node.getChildMeshes()[0] as BABYLON.Mesh;
        this.mesh.parent = null;

        this.weapon = this.entitiesController.createEntities(this.weaponName) as any;
        this.weapon.attachToParent(this.mesh, this);

        this.weapon.position = new BABYLON.Vector3(-1.2, 0, 0);
        this.weapon.rotation = new BABYLON.Vector3();
        this.weapon.computeAnimation(this.weapon.node);
    }

    renderLoop() {
        this.directionVector = this.playerController.camera.body.body.absolutePosition.subtract(this.position);

        if (new Date().getTime() - this.lastFire > this.timeBeetwenFire * 1000) {
            this.fire();
        }
    }

    fire() {
        this.lastFire = new Date().getTime();
        this.weapon.fire();
    }


    wasTouched(by: Structure, at: BABYLON.Mesh, pickInfo: BABYLON.PickingInfo, owner: WeaponOwner): boolean {
        console.log(`DefaultTurret is touch at ${at.name} by ${owner.name}`);
        this.life--;
        if (this.life === 0) {
            this.dispose();
        }
        return true;
    }

    toTouch(touchable: Touchable, pickInfo: BABYLON.PickingInfo) {
    }

    dispose() {
        this.entitiesController.disposeEntity(this);
        super.dispose();
    }
}