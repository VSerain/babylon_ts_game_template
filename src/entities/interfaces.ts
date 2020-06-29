import * as BABYLON from "babylonjs";
import BaseStructure from "app/shared/base-structure"
export interface StoredItem {
    name: string,
    loaded: boolean,
    container?: BABYLON.AssetContainer
}

export interface StoreList {
    [index: string]: StoredItem
}

export interface WeaponOwner {
    name: string,
    directionVector: BABYLON.Vector3
    toTouch(touchable: Touchable, pickInfo: BABYLON.PickingInfo): void
}

export interface Touchable {
    isTouchable: boolean;
    wasTouched(by: BaseStructure, at: BABYLON.AbstractMesh, pickInfo: BABYLON.PickingInfo, owner: WeaponOwner): boolean
}

export interface Weapon extends BaseStructure {
    owner: WeaponOwner;
    attachToParent(parentMesh: BABYLON.Mesh, owner: WeaponOwner): void
    detachToParent(): void
    onParentMoveStatusChange(status: string): void
    fire(): void
}