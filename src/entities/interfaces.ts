import * as BABYLON from "babylonjs";

export interface StoredItem {
    name: string,
    loaded: boolean,
    container?: BABYLON.AssetContainer
}

export interface StoreList {
    [index: string]: StoredItem
}