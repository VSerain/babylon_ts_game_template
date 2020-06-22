import * as BABYLON from "babylonjs";
import Structure from "app/shared/structure";

export interface StoredItem {
    name: string,
    loaded: boolean,
    container?: BABYLON.AssetContainer
}

export interface StoreList {
    [index: string]: StoredItem
}

export interface WeaponOwner {
    directionVector: BABYLON.Vector3
    toTouch(touchable: Touchable, pickInfo: BABYLON.PickingInfo): void
}

export interface Touchable {
    wasTouched(by: Structure, at: BABYLON.AbstractMesh, pickInfo: BABYLON.PickingInfo, owner: WeaponOwner): boolean
}

export interface Weapon extends Structure {
    owner: WeaponOwner;
    attachToParent(parentMesh: BABYLON.Mesh, owner: WeaponOwner): void
    detachToParent(): void
    onParentMoveStatusChange(status: string): void
    fire(): void
}