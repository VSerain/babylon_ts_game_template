import * as BABYLON from "babylonjs";

export interface TypesLoader {
    [index: string]: String
}

export interface ContainerQueueItem {
    file: string,
    resolver: (container: BABYLON.AssetContainer) => void
}

export interface ContainerQueue extends Array<ContainerQueueItem>{}