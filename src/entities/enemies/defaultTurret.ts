import EntityStructure from "app/shared/entity-structure";
import * as BABYLON from "babylonjs";
import { WeaponOwner, Touchable } from "app/entities/interfaces";
import DefaultWeapon from "app/entities/weapons/defaultWeapon";
import BaseStucture from "app/shared/base-structure";

export const name = "default-turret";

export const glb = "turret.glb";

export default class DefaultTurret extends EntityStructure implements WeaponOwner, Touchable {
    entries: BABYLON.InstantiatedEntries;
    directionVector: BABYLON.Vector3 = new BABYLON.Vector3(1,0,0);
    weapon: DefaultWeapon;
    weaponName: string = "default-weapon";

    hand: BABYLON.Mesh;

    lastFire: number = 0;
    timeBeetwenFire: number = 0.8;

    life: number = 3;

    constructor() {
        super({ name: "DefaultTurret" });
        this.require.entitiesController = true;
        this.require.playerController = true;
    }


    load() {
        this.entries = this.entitiesController.store.getEntries(name, `${name} `);
        this.node = this.entries.rootNodes[0];
        console.log(this.entries);
        this.weapon = this.entitiesController.createEntities(this.weaponName) as any;

        this.hand = this.node.getChildMeshes(false, (n => n.name.includes("arm")))[0] as BABYLON.Mesh;
        console.log(this.hand);

        this.hand.setPivotPoint(new BABYLON.Vector3(0, 0.3, 0));
        this.hand.rotate(new BABYLON.Vector3(0,0,1), Math.PI/2, BABYLON.Space.WORLD);

        this.weapon.attachToParent(this.hand, this);

        this.weapon.position = new BABYLON.Vector3(1.2, 3, 0);
        // this.weapon.computeAnimation(this.weapon.getNode());
    }

    renderLoop() {
        this.directionVector = this.playerController.camera.body.body.absolutePosition.subtract(this.position);

        if (new Date().getTime() - this.lastFire > this.timeBeetwenFire * 1000) {
            this.fire();
        }
    }

    fire() {
        this.lastFire = new Date().getTime();
        // this.weapon.fire();
    }


    wasTouched(by: BaseStucture, at: BABYLON.Mesh, pickInfo: BABYLON.PickingInfo, owner: WeaponOwner): boolean {
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